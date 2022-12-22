/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'FastStore',
  tagline: 'Documentation Portal',
  url: 'https://faststore.dev',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'vtex', // Usually your GitHub org/user name.
  projectName: 'faststore', // Usually your repo name.
  themes: ['@docusaurus/theme-live-codeblock'],
  stylesheets: ['https://use.fontawesome.com/releases/v5.15.4/css/all.css'],
  customFields: {
    events: require('./static/data/releases'),
    updatesData: require('./static/data/doc-update'),
    starters: require('./static/data/starters'),
  },
  scripts: ['/scripts/openReplay.js'],
  themeConfig: {
    image: 'img/faststore_thumbnail.png',
    zoom: {
      selector: '.markdown :not(.notClickable)',
      config: {
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)',
        },
      },
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    announcementBar: {
      id: 'csat',
      content: `📢  We’d love to hear about your experience with our Documentation Portal.`,
      textColor: 'var(--ifm-color-details)',
      backgroundColor: 'var(--ifm-tag-highlight)',
      isCloseable: false,
    },
    navbar: {
      title: 'FastStore',
      logo: {
        alt: 'VTEX',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'beta/about',
          position: 'left',
          label: 'Beta program',
        },
        {
          href: '/docs',
          label: 'Documentation',
          position: 'left',
        },
        {
          href: '/faq',
          label: 'FAQ',
          position: 'right',
          target: '_self',
          className: 'FAQbar',
        },
        {
          label: 'Release Notes',
          to: 'releases',
          position: 'right',
        },
        {
          type: 'dropdown',
          label: 'More',
          position: 'right',
          items: [
            {
              href: '/starters',
              label: 'Starters',
              target: '_self',
            },
            {
              href: 'https://community.vtex.com/',
              label: 'Community',
            },
          ],
        },
        {
          href: 'https://github.com/vtex/faststore',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    algolia: {
      apiKey: 'b569ca818413cccb8e41edbcb1dd5161',
      indexName: 'devportal',
      contextualSearch: true,
      appId: 'OAXP53H7GY',
    },
    footer: {
      logo: {
        alt: 'VTEX Logo',
        src: 'img/white-vtex.svg',
        href: 'https://vtex.com',
      },
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Quickstart',
              to: 'quickstart',
            },
            {
              label: 'References',
              to: '/reference',
            },
            {
              label: 'Concepts',
              to: '/conceptual-guides',
            },
            {
              label: 'Tutorials',
              to: '/tutorials/gatsby-overview',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Starters',
              to: '/starters',
            },
            {
              label: 'Frequently asked questions',
              to: '/faq',
            },
            {
              label: 'Release Notes',
              to: '/releases',
            },
            {
              label: 'VTEX Community',
              href: 'https://community.vtex.com/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/vtex/faststore',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} FastStore Docs, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/nightOwlLight'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        gtag: {
          trackingID: 'G-MWFMZBZPHF',
          anonymizeIP: true,
        },
        googleAnalytics: {
          trackingID: 'UA-225353622-2',
          anonymizeIP: true,
        },
        docs: {
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          // Please change this to your repo.
          editUrl: 'https://github.com/vtex/faststore/edit/main/apps/docs',
        },
        blog: {
          routeBasePath: 'releases',
          showReadingTime: true,
          blogSidebarTitle: 'All releases',
          blogSidebarCount: 'ALL',
          blogTitle: 'Release Notes',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
    // [
    //   'redocusaurus',
    //   {
    //     specs: [
    //       {
    //         spec: 'docs/openapi/headlesscms.yaml',
    //         routePath: '/vtex-headless-cms-api',
    //       },
    //     ],
    //   },
    // ],
  ],
  plugins: [
    'docusaurus-tailwindcss-loader',
    require.resolve('docusaurus-plugin-image-zoom'),
    [
      'docusaurus-plugin-react-docgen-typescript',
      {
        // pass in a single string or an array of strings
        src: [
          '../../packages/ui/src/**/*.tsx',
          '!../../packages/ui/src/**/*.test.*',
          '!../../packages/ui/src/**/*.stories.*',
        ],
        parserOptions: {
          // pass parserOptions to react-docgen-typescript
          // here is a good starting point which filters all .tsx files
          propFilter: (prop, component) => {
            if (prop.declarations[0]) {
              return prop.declarations[0].fileName.endsWith('.tsx')
            }

            return false
          },
        },
      },
    ],
  ],
}