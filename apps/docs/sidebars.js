/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'docs',
      },
      items: [
        'tutorials/fundamentals/1',
        'quickstart',
        'playground',
        'glossary',
        'faq',
        'resources',
      ],
    },
    {
      type: 'category',
      label: 'Guided tutorial',
      collapsed: true,
      link: { type: 'doc', id: 'tutorials/gatsby-overview' },
      items: [
        {
          type: 'autogenerated',
          dirName: 'tutorials/gatsby',
        },
      ],
    },
    {
      type: 'category',
      label: 'Performance',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'how-to-guides/performance',
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'how-to-guides/performance',
        },
      ],
    },
    {
      type: 'category',
      label: 'VTEX Platform Integration',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'how-to-guides/platform-integration/vtex-integration',
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'how-to-guides/platform-integration/vtex',
        },
      ],
    },
    {
      type: 'category',
      label: 'VTEX Headless CMS',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'VTEX Headless CMS',
        slug: '/how-to-guides/cms/vtex',
      },
      items: [
        {
          type: 'category',
          label: 'Integrating your storefront with VTEX Headless CMS',
          collapsed: true,
          link: { type: 'doc', id: 'tutorials/cms-overview' },
          items: [
            {
              type: 'autogenerated',
              dirName: 'tutorials/cms',
            },
          ],
        },
        {
          type: 'autogenerated',
          dirName: 'how-to-guides/cms/vtex-headless-cms',
        },
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'VTEX IO WebOps Deployment',
        slug: '/how-to-guides/deployment',
      },
      items: [
        {
          type: 'category',
          label: 'Security',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'how-to-guides/webops/security',
          },
          items: [
            {
              type: 'autogenerated',
              dirName: 'how-to-guides/webops/security',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'how-to-guides/troubleshooting',
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'how-to-guides/troubleshooting',
        },
      ],
    },
    {
      type: 'category',
      label: 'Advanced guides',
      collapsed: true,
      link: { type: 'doc', id: 'conceptual-guides' },
      items: [
        'conceptual-guides/analytics-on-faststore',
        'conceptual-guides/analytics-on-official-starters',
        'conceptual-guides/analytics-store-framework',
      ],
    },
    {
      type: 'category',
      label: 'Contributing',
      link: {
        type: 'generated-index',
        title: 'Contributing',
        slug: 'how-to-guides/contributing',
      },
      className: 'mb-5',
      collapsed: true,
      items: [
        {
          type: 'autogenerated',
          dirName: 'how-to-guides/contributing',
        },
      ],
    },
    {
      type: 'category',
      label: 'APIs and References',
      className: 'border-t py-5',
      link: {
        type: 'generated-index',
        title: 'Contributing',
        slug: 'reference',
      },
      collapsed: false,
      items: [
        'reference',
        {
          type: 'category',
          label: 'UI',
          collapsed: true,
          link: { type: 'doc', id: 'reference/ui/faststore-ui' },
          items: [
            'reference/ui/faststore-ui',
            'reference/ui/get-started-faststore-ui',
            {
              type: 'category',
              label: 'Components',
              link: { type: 'doc', id: 'reference/ui/components' },
              collapsed: true,
              items: [
                {
                  type: 'category',
                  label: 'Atoms',
                  collapsible: false,
                  className: 'fakeCategory',
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'reference/ui/atoms',
                    },
                  ],
                },
                {
                  type: 'category',
                  label: 'Molecules',
                  collapsible: false,
                  className: 'fakeCategory',
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'reference/ui/molecules',
                    },
                  ],
                },
                {
                  type: 'category',
                  label: 'Organisms',
                  collapsible: false,
                  className: 'fakeCategory',
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'reference/ui/organisms',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'API',
          collapsed: true,
          link: { type: 'doc', id: 'reference/api/faststore-api' },
          items: [
            'reference/api/faststore-api',
            'reference/api/get-started',
            {
              type: 'autogenerated',
              dirName: 'how-to-guides/faststore-api',
            },
            {
              type: 'category',
              label: 'Schema',
              collapsed: false,
              items: [
                {
                  type: 'category',
                  label: 'Queries',
                  collapsed: true,
                  link: { type: 'doc', id: 'reference/api/queries' },
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'reference/api/queries',
                    },
                  ],
                },
                {
                  type: 'category',
                  label: 'Mutations',
                  collapsed: true,
                  link: { type: 'doc', id: 'reference/api/mutations' },
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'reference/api/mutations',
                    },
                  ],
                },
                'reference/api/objects',
                'reference/api/inputs',
                'reference/api/enums',
                'reference/api/scalars',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'SDK',
          collapsed: true,
          link: { type: 'doc', id: 'reference/sdk/faststore-sdk' },
          items: [
            {
              type: 'doc',
              id: 'reference/sdk/getting-started-faststore-sdk',
            },
            {
              type: 'category',
              label: 'Analytics',
              link: { type: 'doc', id: 'reference/sdk/analytics' },
              collapsed: true,
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'reference/sdk/analytics',
                },
              ],
            },
            {
              type: 'category',
              label: 'Cart',
              link: { type: 'doc', id: 'reference/sdk/cart' },
              collapsed: true,
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'reference/sdk/cart',
                },
              ],
            },
            {
              type: 'category',
              label: 'Search',
              collapsed: true,
              link: { type: 'doc', id: 'reference/sdk/search' },

              items: [
                {
                  type: 'autogenerated',
                  dirName: 'reference/sdk/search',
                },
              ],
            },
            {
              type: 'doc',
              id: 'reference/sdk/session',
            },
          ],
        },
      ],
    },
  ],
  cmsStoreComponents: [
    {
      type: 'category',
      label: 'Integrating your storefront with VTEX Headless CMS',
      collapsed: false,
      link: { type: 'doc', id: 'tutorials/cms-storecomponents/overview' },
      items: [
        {
          type: 'autogenerated',
          dirName: 'tutorials/cms-storecomponents',
        },
      ],
    },
  ],
  betaProgram: [
    {
      type: 'category',
      label: 'About the program',
      className: 'pb-5 mb-5 border-b labelSidebar',
      collapsed: false,
      collapsible: false,
      items: [
        'beta/about',
        'beta/overview',
        {
          type: 'link',
          label: 'Waiting list',
          href:
            'https://docs.google.com/forms/d/e/1FAIpQLSfmNyT5BepQw2AFyHnrI9-4fqvkOTWvdeBLdkQgxhQ2r0-g4A/viewform',
        },
      ],
    },
    {
      type: 'category',
      label: 'Beta activities',
      className: 'pb-5 mb-5 border-b labelSidebar',
      collapsed: false,
      collapsible: false,
      items: ['beta/feedback-and-issue-tracking', 'beta/customer-invitation'],
    },
    {
      type: 'category',
      label: 'Behavior aspects',
      className: 'labelSidebar',
      collapsed: false,
      collapsible: false,
      items: [
        'beta/features-and-capabilities',
        'beta/changes-from-store-framework',
      ],
    },
  ],
}