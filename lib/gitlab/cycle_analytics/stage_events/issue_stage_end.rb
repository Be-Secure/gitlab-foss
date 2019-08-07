# frozen_string_literal: true

module Gitlab
  module CycleAnalytics
    module StageEvents
      class IssueStageEnd < SimpleStageEvent
        def self.name
          s_("CycleAnalyticsEvent|Issue first associated with a milestone or issue first added to a board")
        end

        def self.identifier
          :issue_stage_end
        end

        def object_type
          Issue
        end

        def timestamp_projection
          Arel::Nodes::NamedFunction.new('COALESCE', [
            issue_metrics_table[:first_associated_with_milestone_at],
            issue_metrics_table[:first_added_to_board_at]
          ])
        end

        def apply_query_customization(query)
          inner_join(query, issue_metrics_table[:issue_id])
        end
      end
    end
  end
end
