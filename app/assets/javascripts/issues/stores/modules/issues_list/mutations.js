import * as types from './mutation_types';

export default {
  [types.SET_LOADING_STATE](state, value) {
    state.loading = value;
  },
  [types.SET_ISSUES_DATA](state, issues) {
    Object.assign(state, {
      issues,
    });
  },
  [types.SET_FILTERS](state, value) {
    state.filters = value;
  },
};
