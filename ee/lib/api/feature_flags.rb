# frozen_string_literal: true

module API
  class FeatureFlags < Grape::API
    include PaginationParams

    FEATURE_FLAG_ENDPOINT_REQUIREMENTS = API::NAMESPACE_OR_PROJECT_REQUIREMENTS
        .merge(name: API::NO_SLASH_URL_PART_REGEX)

    before do
      not_found! unless Feature.enabled?(:feature_flag_api, user_project)
      authorize_read_feature_flags!
    end

    params do
      requires :id, type: String, desc: 'The ID of a project'
    end
    resource 'projects/:id', requirements: API::NAMESPACE_OR_PROJECT_REQUIREMENTS do
      resource :feature_flags do
        desc 'Get all feature flags of a project' do
          success EE::API::Entities::FeatureFlag
        end
        params do
          optional :scope, type: String, desc: 'The scope of feature flags',
                                         values: %w[enabled disabled]
          use :pagination
        end
        get do
          feature_flags = ::FeatureFlagsFinder
            .new(user_project, current_user, declared_params(include_missing: false))
            .execute

          present paginate(feature_flags), with: EE::API::Entities::FeatureFlag
        end

        desc 'Create a new feature flag' do
          success EE::API::Entities::FeatureFlag
        end
        params do
          requires :name, type: String, desc: 'The name of feature flag'
          optional :description, type: String, desc: 'The description of the feature flag'
          optional :scopes, type: Array do
            requires :environment_scope, type: String, desc: 'The environment scope of the scope'
            requires :active, type: Boolean, desc: 'Active/inactive of the scope'
            requires :strategies, type: JSON, desc: 'The strategies of the scope'
          end
        end
        post do
          authorize_create_feature_flag!

          param = declared_params(include_missing: false)
          param[:scopes_attributes] = param.delete(:scopes) if param.key?(:scopes)

          result = ::FeatureFlags::CreateService
            .new(user_project, current_user, param)
            .execute

          if result[:status] == :success
            present result[:feature_flag], with: EE::API::Entities::FeatureFlag
          else
            render_api_error!(result[:message], result[:http_status])
          end
        end
      end

      params do
        requires :name, type: String, desc: 'The name of the feature flag'
      end
      resource 'feature_flags/:name', requirements: FEATURE_FLAG_ENDPOINT_REQUIREMENTS do
        desc 'Get a feature flag of a project' do
          success EE::API::Entities::FeatureFlag
        end
        get do
          authorize_read_feature_flag!

          present feature_flag, with: EE::API::Entities::FeatureFlag
        end

        desc 'Delete a feature flag' do
          success EE::API::Entities::FeatureFlag
        end
        delete do
          authorize_destroy_feature_flag!

          result = ::FeatureFlags::DestroyService
            .new(user_project, current_user, declared_params(include_missing: false))
            .execute(feature_flag)

          if result[:status] == :success
            present result[:feature_flag], with: EE::API::Entities::FeatureFlag
          else
            render_api_error!(result[:message], result[:http_status])
          end
        end
      end
    end

    helpers do
      def authorize_read_feature_flags!
        authorize! :read_feature_flag, user_project
      end

      def authorize_read_feature_flag!
        authorize! :read_feature_flag, feature_flag
      end

      def authorize_create_feature_flag!
        authorize! :create_feature_flag, user_project
      end

      def authorize_destroy_feature_flag!
        authorize! :destroy_feature_flag, feature_flag
      end

      def feature_flag
        @feature_flag ||=
          user_project.operations_feature_flags.find_by_name!(params[:name])
      end
    end
  end
end