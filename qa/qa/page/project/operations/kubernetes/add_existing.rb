module QA
  module Page
    module Project
      module Operations
        module Kubernetes
          class AddExisting < Page::Base
            include QA::Page::Clusters::Shared::AddExisting
          end
        end
      end
    end
  end
end
