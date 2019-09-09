# frozen_string_literal: true

module QA
  module EE
    module Page
      module Group
        class Members < QA::Page::Base
          view 'ee/app/views/groups/group_members/_sync_button.html.haml' do
            element :sync_now_button
          end

          def click_sync_now
            click_element :sync_now_button
          end
        end
      end
    end
  end
end