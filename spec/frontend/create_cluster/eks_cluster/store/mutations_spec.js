import {
  REQUEST_REGIONS,
  RECEIVE_REGIONS_ERROR,
  RECEIVE_REGIONS_SUCCESS,
} from '~/create_cluster/eks_cluster/store/mutation_types';
import createState from '~/create_cluster/eks_cluster/store/state';
import mutations from '~/create_cluster/eks_cluster/store/mutations';

describe('Create EKS cluster store mutations', () => {
  let state;
  let emptyPayload;
  let regions;
  let error;

  beforeEach(() => {
    emptyPayload = {};
    regions = [{ name: 'regions-1' }];
    error = new Error('could not load error');
    state = createState();
  });

  it.each`
    mutation                   | mutatedProperty          | payload         | expectedValue | expectedValueDescription
    ${REQUEST_REGIONS}         | ${'isLoadingRegions'}    | ${emptyPayload} | ${true}       | ${true}
    ${REQUEST_REGIONS}         | ${'loadingRegionsError'} | ${emptyPayload} | ${null}       | ${null}
    ${RECEIVE_REGIONS_SUCCESS} | ${'isLoadingRegions'}    | ${{ regions }}  | ${false}      | ${false}
    ${RECEIVE_REGIONS_SUCCESS} | ${'regions'}             | ${{ regions }}  | ${regions}    | ${'regions payload'}
    ${RECEIVE_REGIONS_ERROR}   | ${'isLoadingRegions'}    | ${{ error }}    | ${false}      | ${false}
    ${RECEIVE_REGIONS_ERROR}   | ${'error'}               | ${{ error }}    | ${error}      | ${'received error object'}
  `(`$mutation sets $mutatedProperty to $expectedValueDescription`, data => {
    const { mutation, mutatedProperty, payload, expectedValue } = data;

    mutations[mutation](state, payload);
    expect(state[mutatedProperty]).toBe(expectedValue);
  });
});
