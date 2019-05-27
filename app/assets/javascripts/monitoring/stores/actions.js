import * as types from './mutation_types';
import axios from '~/lib/utils/axios_utils';
import createFlash from '~/flash';
import statusCodes from '../../lib/utils/http_status';
import { backOff } from '../../lib/utils/common_utils';
import { s__, __ } from '../../locale';

const MAX_REQUESTS = 3;

function backOffRequest(makeRequestCallback) {
  let requestCounter = 0;
  return backOff((next, stop) => {
    makeRequestCallback()
      .then(resp => {
        if (resp.status === statusCodes.NO_CONTENT) {
          requestCounter += 1;
          if (requestCounter < MAX_REQUESTS) {
            next();
          } else {
            stop(new Error(__('Failed to connect to the prometheus server')));
          }
        } else {
          stop(resp);
        }
      })
      .catch(stop);
  });
}

export const setGettingStartedEmptyState = ({ commit }) => {
  commit(types.SET_GETTING_STARTED_EMPTY_STATE);
};

export const setEndpoints = ({ commit }, endpoints) => {
  commit(types.SET_ENDPOINTS, endpoints);
};

export const setDashboardEnabled = ({ commit }, enabled) => {
  commit(types.SET_DASHBOARD_ENABLED, enabled);
};

export const requestMetricsData = ({ commit }) => commit(types.REQUEST_METRICS_DATA);
export const receiveMetricsDataSuccess = ({ commit }, data) =>
  commit(types.RECEIVE_METRICS_DATA_SUCCESS, data);
export const receiveMetricsDataFailure = ({ commit }, error) =>
  commit(types.RECEIVE_METRICS_DATA_FAILURE, error);
export const receiveDeploymentsDataSuccess = ({ commit }, data) =>
  commit(types.RECEIVE_DEPLOYMENTS_DATA_SUCCESS, data);
export const receiveDeploymentsDataFailure = ({ commit }) =>
  commit(types.RECEIVE_DEPLOYMENTS_DATA_FAILURE);
export const receiveEnvironmentsDataSuccess = ({ commit }, data) =>
  commit(types.RECEIVE_ENVIRONMENTS_DATA_SUCCESS, data);
export const receiveEnvironmentsDataFailure = ({ commit }) =>
  commit(types.RECEIVE_ENVIRONMENTS_DATA_FAILURE);

export const fetchData = ({ dispatch }, params) => {
  dispatch('fetchMetricsData', params);
  dispatch('fetchDeploymentsData');
  dispatch('fetchEnvironmentsData');
};

export const fetchMetricsData = ({ state, dispatch }, params) => {
  if (state.useDashboardEndpoint) {
    return dispatch('fetchDashboard', params);
  }

  dispatch('requestMetricsData');

  return backOffRequest(() => axios.get(state.metricsEndpoint, { params }))
    .then(resp => resp.data)
    .then(response => {
      if (!response || !response.data || !response.success) {
        dispatch('receiveMetricsDataFailure', null);
        createFlash(s__('Metrics|Unexpected metrics data response from prometheus endpoint'));
      }
      dispatch('receiveMetricsDataSuccess', response.data);
    })
    .catch(error => {
      dispatch('receiveMetricsDataFailure', error);
      createFlash(s__('Metrics|There was an error while retrieving metrics'));
    });
};

export const fetchDashboard = ({ state, commit, dispatch }, params) => {
  return axios
    .get(state.dashboardEndpoint, { params })
    .then(resp => resp.data)
    .then(response => {
      if (!response || response.status !== 'success') {
        throw new Error(s__('Metrics|Unexpected metrics data response from prometheus endpoint'));
      }

      commit(types.SET_GROUPS, response.dashboard.panel_groups);
      dispatch('fetchPrometheusMetrics', params);
    })
    .catch(e => {
      throw e;
    });
};

export const fetchPrometheusMetrics = ({ state, dispatch }, params) => {
  state.groups.forEach(group => {
    group.panels.forEach(panel => {
      panel.queries = panel.metrics;
      panel.queries.forEach(metric => {
        dispatch('fetchPrometheusMetric', { metric, startEnd: params });
      });
    });
  });
};

function fetchPrometheusResult(prometheusEndpoint, params) {
  return backOffRequest(() => axios.get(prometheusEndpoint, { params }))
    .then(res => res.data)
    .then(response => {
      if (response.status === 'error') {
        // {"status":"error","errorType":"bad_data","error":"exceeded maximum resolution of 11,000 points per timeseries. Try decreasing the query resolution (?step=XX)"}
      }

      const { resultType, result } = response.data;

      if (resultType === 'matrix') {
        if (result.length > 0) {
          return result;
        }
      }
    });
}

/**
 * Returns list of metrics in data.result
 * {"status":"success", "data":{"resultType":"matrix","result":[]}}
 *
 * @param {metric} metric
 */
export const fetchPrometheusMetric = ({ commit, getters }, { metric, startEnd }) => {
  const queryType = Object.keys(metric).find(key => ['query', 'query_range'].includes(key));
  const query = metric[queryType];
  // TODO don't hardcode
  const prometheusEndpoint = `/root/metrics/environments/37/prometheus/api/v1/${queryType}`;

  // todo use timewindow
  const timeDiff = 8 * 60 * 60; // 8hours in seconnds
  const end = startEnd.end || Math.floor(Date.now() / 1000);
  const start = startEnd.start || end - timeDiff;

  const minStep = 60;
  const queryDataPoints = 600;
  const step = Math.max(minStep, Math.ceil(timeDiff / queryDataPoints));

  const params = {
    query,
    start,
    end,
    step,
  };

  fetchPrometheusResult(prometheusEndpoint, params).then(result => {
    commit(types.SET_QUERY_RESULT, { metricId: metric.metric_id, result });
  });
};

export const fetchDeploymentsData = ({ state, dispatch }) => {
  if (!state.deploymentEndpoint) {
    return Promise.resolve([]);
  }
  return backOffRequest(() => axios.get(state.deploymentEndpoint))
    .then(resp => resp.data)
    .then(response => {
      if (!response || !response.deployments) {
        createFlash(s__('Metrics|Unexpected deployment data response from prometheus endpoint'));
      }

      dispatch('receiveDeploymentsDataSuccess', response.deployments);
    })
    .catch(() => {
      dispatch('receiveDeploymentsDataFailure');
      createFlash(s__('Metrics|There was an error getting deployment information.'));
    });
};

export const fetchEnvironmentsData = ({ state, dispatch }) => {
  if (!state.environmentsEndpoint) {
    return Promise.resolve([]);
  }
  return axios
    .get(state.environmentsEndpoint)
    .then(resp => resp.data)
    .then(response => {
      if (!response || !response.environments) {
        createFlash(
          s__('Metrics|There was an error fetching the environments data, please try again'),
        );
      }
      dispatch('receiveEnvironmentsDataSuccess', response.environments);
    })
    .catch(() => {
      dispatch('receiveEnvironmentsDataFailure');
      createFlash(s__('Metrics|There was an error getting environments information.'));
    });
};

// prevent babel-plugin-rewire from generating an invalid default during karma tests
export default () => {};
