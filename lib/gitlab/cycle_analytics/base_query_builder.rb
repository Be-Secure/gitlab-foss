# frozen_string_literal: true

module Gitlab
  module CycleAnalytics
    class BaseQueryBuilder
      include Gitlab::CycleAnalytics::MetricsTables
      include StageQueryHelpers

      delegate :subject_model, to: :stage

      PROJECT_QUERY_RULES = {
        Project => {
          Issue => ->(query) {
            query.join(projects_table).on(issue_table[:project_id].eq(projects_table[:id]))
              .where(issue_table[:project_id].eq(stage.parent.id))
          },
          MergeRequest => ->(query) {
            query.join(projects_table).on(mr_table[:target_project_id].eq(projects_table[:id]))
              .where(mr_table[:target_project_id].eq(stage.parent.id))
          }
        }
      }.freeze

      def initialize(stage:, params: {})
        @stage = stage
        @params = params
      end

      def apply
        query = model_arel_table
        query = filter_by_parent_model(query)
        query = filter_by_time_range(query)
        query = query.join(routes_table).on(projects_table[:namespace_id].eq(routes_table[:source_id]))
        query = stage.start_event.apply_query_customization(query)
        query = stage.end_event.apply_query_customization(query)
        query = query.where(duration.gt(zero_interval))
        query.where(routes_table[:source_type].eq('Namespace'))
      end

      private

      attr_reader :stage, :params

      def filter_by_parent_model(query)
        instance_exec(query, &query_rules.fetch(stage.parent.class).fetch(subject_model))
      end

      def filter_by_time_range(query)
        from = params[:from] || 30.days.ago
        to = params[:to] || nil

        query = query.where(model_arel_table[:created_at].gteq(from))
        query = query.where(model_arel_table[:created_at].lteq(to)) if to
        query
      end

      def model_arel_table
        subject_model.arel_table
      end

      # EE will override this to include Group rules
      def query_rules
        PROJECT_QUERY_RULES
      end
    end
  end
end
