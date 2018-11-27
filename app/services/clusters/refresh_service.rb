# frozen_string_literal: true

module Clusters
  class RefreshService
    def create_or_update_namespaces_for_cluster(cluster)
      cluster_namespaces = cluster.kubernetes_namespaces

      # Create all namespaces that are missing for each project
      cluster.all_projects.missing_kubernetes_namespace(cluster_namespaces).each do |project|
        kubernetes_namespace = cluster.find_or_initialize_kubernetes_namespace_for_project(project)

        ::Clusters::Gcp::Kubernetes::CreateOrUpdateNamespaceService.new(
          cluster: cluster,
          kubernetes_namespace: kubernetes_namespace
        ).execute
      end
    end

    def create_or_update_namespaces_for_project(project)
      project_namespaces = project.kubernetes_namespaces

      #project_namespaces.where.not(cluster: project.all_clusters).each do |kubernetes_namespace|
        #kubernetes_namespace.destroy!
      #end

      # Create all namespaces that are missing for each cluster
      project.all_clusters.missing_kubernetes_namespace(project_namespaces).each do |cluster|
        kubernetes_namespace = cluster.find_or_initialize_kubernetes_namespace_for_project(project)

        ::Clusters::Gcp::Kubernetes::CreateOrUpdateNamespaceService.new(
          cluster: cluster,
          kubernetes_namespace: kubernetes_namespace
        ).execute
      end
    end
  end
end
