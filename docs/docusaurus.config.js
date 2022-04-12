/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'FastStore',
  tagline: 'Documentation Portal',
  url: 'https://faststore.dev',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'vtex', // Usually your GitHub org/user name.
  projectName: 'faststore', // Usually your repo name.
  themes: ['@docusaurus/theme-live-codeblock'],
  stylesheets: [
    "https://use.fontawesome.com/releases/v5.0.6/css/all.css"
  ],
  customFields: {
    events: require("./static/data/releases"),
    updatesData: require("./static/data/doc-update"),
    starters: require("./static/data/starters"),
  },
  themeConfig: {
    zoom: {
      selector: '.markdown :not(a) > img',
      config: {
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)'
        }
      }
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false
    },
    announcementBar: {
      id: 'support_us',
      content:
        `📢 <span style="color:#F71963; background-color:#FFF3F6; padding:0.5em; margin:0.3em; border-radius:5px; font-weight: bold" >NEW</span> <strong>VTEX Developers</strong> - YouTube channel with live demos, code walkthroughs, and interviews for developers. <a style="color:#F71963" href="https://www.youtube.com/channel/UCReNhDqLOVL4edqENJ4k7Fg">Subscribe now</a>`,
      textColor: "#142032",
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
          href: '/quickstart',
          label: 'Quickstart',
          position: 'left',
        },
        {
          type: 'doc',
          docId: 'tutorials',
          position: 'left',
          label: 'Tutorials',
        },
        {
          type: 'doc',
          docId: 'how-to-guides',
          position: 'left',
          label: 'How-to Guides',
        },
        {
          type: 'doc',
          docId: 'reference',
          position: 'left',
          label: 'References',
        },
        {
          type: 'doc',
          docId: 'conceptual-guides',
          position: 'left',
          label: 'Concepts',
        },
        {
          href: "/faq",
          label: "FAQ",
          position: "right",
          target: "_self",
          className: "FAQbar"
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
              href: "/starters",
              label: "Starters",
              target: "_self",
            },
            {
              href: 'https://community.vtex.com/',
              label: 'Community',
            },
            {
              href: 'https://github.com/vtex/faststore',
              label: 'GitHub',
            },
          ],
        },
      ],
    },
    algolia: {
      apiKey: 'b569ca818413cccb8e41edbcb1dd5161',
      indexName: 'devportal',
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
          title: 'Docs',
          items: [
            {
              label: 'Quickstart',
              to: 'quickstart',
            },
            {
              label: 'Tutorials',
              to: '/tutorials',
            },
            {
              label: 'How-to guides',
              to: '/how-to-guides',
            },
            {
              label: 'References',
              to: '/reference',
            },
            {
              label: 'Concepts',
              to: '/conceptual-guides',
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
      theme: require('prism-react-renderer/themes/nightOwlLight')
    },
  },

  presets: [
    [
      '@docusaurus/preset-classic',    
      {
        gtag: {
          trackingID: 'GTM-PKST2NM',
          anonymizeIP: true,
        },
        googleAnalytics: {
          trackingID: 'G-WQPXL33BZX',
          anonymizeIP: true,
        },
        docs: {
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), {sync: true}],
          ],
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          // Please change this to your repo.
          editUrl:
            'https://github.com/vtex/faststore/edit/master/docs',
        },
        blog: {
          routeBasePath: 'releases',
          showReadingTime: true,
          blogSidebarTitle: 'Updates',
          blogSidebarCount: 'ALL',
          blogTitle: 'Release Notes'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            spec: 'docs/openapi/headlesscms.yaml',
            routePath: '/vtex-headless-cms-api',
          },
        ],
      },
    ],
  ],
  plugins: [
    'docusaurus-tailwindcss-loader',
    require.resolve('docusaurus-plugin-image-zoom'),
    [
      'docusaurus-plugin-react-docgen-typescript',
      {
        // pass in a single string or an array of strings
        src: ['../packages/ui/src/**/*.tsx', '!../packages/ui/src/**/*.test.*', '!../packages/ui/src/**/*.stories.*'],
        parserOptions: {
          // pass parserOptions to react-docgen-typescript
          // here is a good starting point which filters all .tsx files
          propFilter: (prop, component) => {
            if (prop.declarations[0]) {
              return prop.declarations[0].fileName.endsWith('.tsx')
            }

            return false;
          },
        },
      },
    ]
  ],
};
