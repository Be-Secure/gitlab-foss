# frozen_string_literal: true

module Gitlab
  module Tracing
    module Common
      def tracer
        OpenTracing.global_tracer
      end

      # Convience method for running a block with a span
      def start_active_span(operation_name:, tags:, child_of: nil)
        scope = tracer.start_active_span(
          operation_name,
          child_of: child_of,
          tags: tags
        )
        span = scope.span

        # Add correlation details to the span if we have them
        correlation_id = Gitlab::CorrelationId.current_id
        if correlation_id
          span.set_tag('correlation_id', correlation_id)
        end

        begin
          yield span
        rescue StandardError => e
          log_exception_on_span(span, e)
          raise e
        ensure
          scope.close
        end
      end

      def log_exception_on_span(span, exception)
        span.set_tag('error', true)

        if exception.is_a? Exception
          span.log_kv(
            'event':        'error',
            'error.kind':   exception.class.to_s,
            'error.object': exception,
            'message':      exception.message,
            'stack':        exception.backtrace.join("\n")
          )
        else
          span.log_kv(
            'event':        'error',
            'error.kind':   exception.class.to_s,
            'error.object': exception
          )
        end
      end
    end
  end
end
