# frozen_string_literal: true

module Atlassian
  class JiraIssueKeyExtractor
    def initialize(*text)
      @text = text.join(' ')
    end

    def issue_keys
      @text.scan(Gitlab::Regex.jira_issue_key_regex).uniq
    end
  end
end
