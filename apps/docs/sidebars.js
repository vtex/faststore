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
      label: 'Documentation',
      collapsed: false,
      collapsible: false,
      link: { type: 'generated-index', title: 'Documentation', slug: 'docs' },
      items: [
        'quickstart',
        'playground',
        {
          type: 'category',
          label: 'How-to Guides',
          collapsed: true,
          link: {
            type: 'generated-index',
            title: 'How-to Guides',
            slug: 'how-to-guides',
            description:
              'Solve real-world issues by following our goal-oriented step-by-step guides.',
          },
          items: [
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
              label: 'Platform Integration',
              collapsed: true,
              link: {
                type: 'generated-index',
                title: 'Platform Integration',
                slug: '/how-to-guides/platform-integration',
              },
              items: [
                {
                  type: 'category',
                  label: 'VTEX',
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
              ],
            },
            {
              type: 'category',
              label: 'CMS Integration',
              collapsed: true,
              link: {
                type: 'generated-index',
                title: 'VTEX Headless CMS',
                slug: '/how-to-guides/cms/vtex-headless-cms',
              },
              items: [
                {
                  type: 'category',
                  label: 'VTEX Headless CMS',
                  collapsed: true,
                  link: {
                    type: 'generated-index',
                    title: 'VTEX',
                    slug: '/how-to-guides/cms/vtex',
                  },
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'how-to-guides/cms/vtex-headless-cms',
                    },
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Deployment',
              collapsed: true,
              link: {
                type: 'generated-index',
                title: 'Deployment',
                slug: '/how-to-guides/deployment',
              },
              items: [
                {
                  type: 'category',
                  label: 'VTEX IO WebOps',
                  collapsed: true,
                  link: {
                    type: 'generated-index',
                    title: 'VTEX IO WebOps',
                    slug: '/how-to-guides/webops',
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
              ],
            },
            {
              type: 'category',
              label: 'FastStore API',
              collapsed: true,
              link: {
                type: 'generated-index',
                title: 'FastStore API',
                slug: 'how-to-guides/faststore-api',
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'how-to-guides/faststore-api',
                },
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
              collapsed: true,
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'how-to-guides/contributing',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'References',
          collapsed: true,
          link: { type: 'doc', id: 'reference' },
          items: [
            {
              type: 'category',
              label: 'FastStore UI',
              collapsed: true,
              link: { type: 'doc', id: 'reference/ui/faststore-ui' },
              items: [
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
              label: 'FastStore SDK',
              collapsed: true,
              link: { type: 'doc', id: 'reference/sdk/faststore-sdk' },
              items: [
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
              ],
            },
            {
              type: 'category',
              label: 'FastStore API',
              collapsed: true,
              link: { type: 'doc', id: 'reference/api/faststore-api' },
              items: [
                'reference/api/get-started',
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
          label: 'Concepts',
          collapsed: true,
          link: { type: 'doc', id: 'conceptual-guides' },
          items: [
            'conceptual-guides/analytics-on-faststore',
            'conceptual-guides/analytics-on-starters',
          ],
        },
        'faq',
        'resources',
        {
          type: 'link',
          label: 'Github',
          href: 'https://github.com/vtex/faststore',
        },
      ],
    },
  ],
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: false,
      collapsible: false,
      link: { type: 'doc', id: 'tutorials' },
      items: [
        {
          type: 'category',
          label: 'Fundamentals',
          collapsed: true,
          items: [
            'tutorials/fundamentals/0',
            'tutorials/fundamentals/1',
            'tutorials/fundamentals/2',
          ],
        },
        {
          type: 'category',
          label: 'Creating storefronts with Gatsby',
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
}
