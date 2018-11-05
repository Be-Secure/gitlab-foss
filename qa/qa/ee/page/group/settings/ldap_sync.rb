# frozen_string_literal: true

module QA
  module EE
    module Page
      module Group
        module Settings
          class LDAPSync < ::QA::Page::Base
            include QA::Page::Component::Select2Search

            view 'ee/app/views/ldap_group_links/_form.html.haml' do
              element :ldap_group_cn_select
              element :add_sync_button
            end

            def set_sync_method(method)
              choose method
            end

            def set_group_cn(group_cn)
              click_element :ldap_group_cn_select
              search_and_select(group_cn)
            end

            def click_add_sync_button
              click_element :add_sync_button
            end
          end
        end
      end
    end
  end
end
