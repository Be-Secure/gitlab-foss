// Using https://gitlab.com/gitlab-org/gitlab-ce/-/jobs/278912562

export default {
  id: 278912562,
  status: 'failed',
  complete: true,
  state:
    'eyJvZmZzZXQiOjQ5NzU5NCwibl9vcGVuX3RhZ3MiOjAsImZnX2NvbG9yIjpudWxsLCJiZ19jb2xvciI6bnVsbCwic3R5bGVfbWFzayI6MCwic2VjdGlvbnMiOltdLCJsaW5lbm9faW5fc2VjdGlvbiI6MTJ9',
  append: false,
  truncated: false,
  offset: 0,
  size: 497594,
  total: 497594,

  lines: [
    {
      content: [{ text: 'Running with gitlab-runner 12.1.0 (de7731dd)' }],
    },
    {
      content: [{ text: ' on docker-auto-scale-com 8a6210b8' }],
    },
    {
      content: [
        {
          text:
            'Using Docker executor with image dev.gitlab.org:5005/gitlab/gitlab-build-images:ruby-2.6.3-golang-1.11-git-2.22-chrome-73.0-node-12.x-yarn-1.16-postgresql-9.6-graphicsmagick-1.3.33',
        },
      ],
      sections: ['prepare-executor'],
      section_header: true,
      section_timestamp: 1566571786,
    },
    {
      content: [{ text: 'Starting service postgres:9.6.14 ...' }],
      sections: ['prepare-executor'],
      section_header: true,
    },
    {
      content: [{ text: 'Pulling docker image postgres:9.6.14 ...' }],
      sections: ['prepare-executor'],
      section_header: true,
    },
    {
      content: [
        {
          text: `Using docker image sha256:ac400042d32f8e146477ae5b3528f1e4232fc8e83b2fd9fe0cbe08900e45bae1 for
      postgres:9.6.14 ...`,
        },
      ],
      sections: ['prepare-executor'],
      section_header: true,
    },
    {
      content: [{ text: 'Starting service redis:alpine ...' }],
      sections: ['prepare-executor'],
      section_header: true,
    },
    {
      content: [{ text: 'Pulling docker image redis:alpine ...' }],
      sections: ['prepare-executor'],
      section_header: true,
    },
    {
      content: [
        {
          text: `Using docker image sha256:ed7d2ff5a6232b43bdc89a2220ed989f532c3794422aa2a86823b8bc62e71447 for
      redis:alpine ...`,
        },
      ],
      sections: ['prepare-executor'],
      section_header: true,
    },
    {
      content: [{ text: 'Waiting for services to be up and running...' }],
      sections: ['prepare-executor'],
      section_header: true,
    },
    {
      content: [
        {
          text: `Pulling docker image
      dev.gitlab.org:5005/gitlab/gitlab-build-images:ruby-2.6.3-golang-1.11-git-2.22-chrome-73.0-node-12.x-yarn-1.16-postgresql-9.6-graphicsmagick-1.3.33
      ...`,
        },
      ],
      sections: ['prepare-executor'],
      section_header: true,
    },
    {
      content: [
        {
          text: `Using docker image sha256:f5b71ccc7a53408ea88959433baf23f7d716bb431d0475a4f3d9ba213d7841c1 for
      dev.gitlab.org:5005/gitlab/gitlab-build-images:ruby-2.6.3-golang-1.11-git-2.22-chrome-73.0-node-12.x-yarn-1.16-postgresql-9.6-graphicsmagick-1.3.33
      ...`,
        },
      ],
      sections: ['prepare-executor'],
      section_header: true,
    },
    //line 36 of log.html

    {
      content: [
        {
          text: `Running on runner-8a6210b8-project-13083-concurrent-0 via
      runner-8a6210b8-gsrm-1566561403-37c881a0...`,
        },
      ],
      sections: ['prepare-script'],
      section_header: true,
      section_timestamp: 1566571798,
    },

    {
      content: [
        { text: 'Fetching changes with git depth set to 20..', class: 'term-fg-l-green term-bold' },
      ],
      sections: ['get-sources'],
      section_header: true,
      section_timestamp: 1566571800,
    },

    {
      content: [
        // lines 59 to 63 - double check due to the <br>
        {
          text: `Reinitialized existing Git repository in /builds/gitlab-org/gitlab-ce/.git/<br />From
      https://gitlab.com/gitlab-org/gitlab-ce`,
        },
        {
          text: ' * [new branch] 66454-create-feature-flag -&gt; origin/66454-create-feature-flag',
        },
      ],
      sections: ['get-sources'],
    },

    {
      content: [
        {
          text: 'Checking out 061606b4 as 66454-create-feature-flag...',
          class: 'term-fg-l-green term-bold'
        },
      ],
      sections: ['get-sources'],
    },

    {
      content: [
        {
          text: `Removing .gitlab_shell_secret<br />Removing .gitlab_workhorse_secret<br />Removing
          config/database.yml`,
        },
        {
          text: '' // line 65

        }
      ],
      sections: ['get-sources'],
    },
  ],
};
