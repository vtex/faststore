/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  tutorialSidebar: [
    'tutorials/overview',
    {
      type: 'category',
      label: 'Fundamentals',
      collapsed: false,
      items: [
        'tutorials/fundamentals/0',
        'tutorials/fundamentals/1',
        'tutorials/fundamentals/2',
      ],
    },
    {
      type: 'category',
      label: 'Creating storefronts with Gatsby',
      collapsed: false,
      items: [
        'tutorials/gatsby/overview',
        'tutorials/gatsby/1',
        'tutorials/gatsby/2',
        'tutorials/gatsby/3',
        'tutorials/gatsby/4',
        'tutorials/gatsby/5',
        'tutorials/gatsby/6',
      ],
    },
  ],
  howToGuidesSidebar: ['how-to-guides/overview',
  {
    type: 'category',
    label: 'Contributing',
    collapsed: false,
    items: [
      {
        type: 'autogenerated',
        dirName: 'how-to-guides/contributing',
      },
    ],
  },],
  conceptsSidebar: ['conceptual-guides/overview'],
  referenceSidebar: [
    'reference/faststore',
    {
      type: 'category',
      label: 'UI',
      collapsed: false,
      items: [
        'reference/ui/faststore-ui',
        'reference/ui/get-started-faststore-ui',
        {
          type: 'category',
          label: 'Atoms',
          collapsed: false,
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
          collapsed: false,
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
          collapsed: false,
          items: [
            {
              type: 'autogenerated',
              dirName: 'reference/ui/organisms',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'SDK',
      collapsed: false,
          items: [
            'reference/sdk/faststore-sdk',
            'reference/sdk/Analytics',
            'reference/sdk/Cart',
            'reference/sdk/Search',
            'reference/sdk/UI',
      ],
    },
    {
      type: 'category',
      label: 'API',
      collapsed: false,
          items: [
            'reference/api/faststore-api',
      ],
    },
  ],
}
