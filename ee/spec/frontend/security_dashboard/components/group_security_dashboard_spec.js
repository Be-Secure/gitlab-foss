import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import GroupSecurityDashboard from 'ee/security_dashboard/components/group_security_dashboard.vue';
import SecurityDashboard from 'ee/security_dashboard/components/app.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const dashboardDocumentation = '/help/docs';
const emptyStateSvgPath = '/svgs/empty/svg';
const projectsEndpoint = '/projects';
const vulnerabilitiesEndpoint = '/vulnerabilities';
const vulnerabilitiesCountEndpoint = '/vulnerabilities_summary';
const vulnerabilitiesHistoryEndpoint = '/vulnerabilities_history';
const vulnerabilityFeedbackHelpPath = '/vulnerabilities_feedback_help';

describe('Group Security Dashboard component', () => {
  let store;
  let wrapper;

  const factory = () => {
    store = new Vuex.Store({
      modules: {
        projects: {
          namespaced: true,
          actions: {
            fetchProjects() {},
            setProjectsEndpoint() {},
          },
        },
      },
    });
    jest.spyOn(store, 'dispatch').mockImplementation();

    wrapper = shallowMount(GroupSecurityDashboard, {
      localVue,
      store,
      sync: false,
      propsData: {
        dashboardDocumentation,
        emptyStateSvgPath,
        projectsEndpoint,
        vulnerabilitiesEndpoint,
        vulnerabilitiesCountEndpoint,
        vulnerabilitiesHistoryEndpoint,
        vulnerabilityFeedbackHelpPath,
      },
    });
  };

  afterEach(() => {
    wrapper.destroy();
  });

  describe('on creation', () => {
    beforeEach(() => {
      factory();
    });

    it('dispatches the expected actions', () => {
      expect(store.dispatch.mock.calls).toEqual([
        ['projects/setProjectsEndpoint', projectsEndpoint],
        ['projects/fetchProjects', undefined],
      ]);
    });

    it('renders the security dashboard', () => {
      const dashboard = wrapper.find(SecurityDashboard);
      expect(dashboard.exists()).toBe(true);
      expect(dashboard.props()).toEqual(
        expect.objectContaining({
          dashboardDocumentation,
          emptyStateSvgPath,
          vulnerabilitiesEndpoint,
          vulnerabilitiesCountEndpoint,
          vulnerabilitiesHistoryEndpoint,
          vulnerabilityFeedbackHelpPath,
        }),
      );
    });
  });
});