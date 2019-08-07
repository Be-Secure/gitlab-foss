# frozen_string_literal: true

module Gitlab
  module CycleAnalytics
    module StageEvents
      # Base class for expressing an event.
      class StageEvent
        include Gitlab::CycleAnalytics::MetricsTables

        def initialize(params)
          @params = params
        end

        def self.name
          raise NotImplementedError
        end

        # Each StageEvent must expose a timestamp or a timestamp like expression in order to build a range query.
        # Example: get me all the Issue records between start event end end event
        def timestamp_projection
          raise NotImplementedError
        end

        # Optionally a StageEvent may apply additional filtering or join other tables on the base query.
        def apply_query_customization(query)
          query
        end

        private

        attr_reader :params

        # inner joins a table by a column, table won't be joined if it's already joined
        #
        # Example:
        #
        # INNER JOIN "table for right_column" ON left_column = right_column;
        #
        # Attributes:
        #
        # * +query+ - Arel query
        # * +right_column+ - Column on the right side
        # * +left_column+ - Defaults to the 'id' column
        def inner_join(query, right_column, left_column = object_type.arel_table[:id])
          return query if table_already_inner_joined?(query, right_column.relation)

          query
            .join(right_column.relation)
            .on(left_column.eq(right_column))
        end

        def table_already_inner_joined?(query, table)
          return false unless query.is_a?(Arel::SelectManager)

          Array(query.source.right).any? { |join| join.left.eql?(table) }
        end
      end
    end
  end
end
