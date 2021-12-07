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
        'tutorials/architecture/0',
        'tutorials/architecture/1',
        'tutorials/architecture/2',
        'tutorials/architecture/3',
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
    {
      type: 'category',
      label: 'Integrating your storefront with VTEX Headless CMS',
      collapsed: false,
      items: [
        'tutorials/VTEX-CMS/overview',
        'tutorials/VTEX-CMS/0',
        'tutorials/VTEX-CMS/1',
        'tutorials/VTEX-CMS/2',
        'tutorials/VTEX-CMS/3',
        'tutorials/VTEX-CMS/4',
        'tutorials/VTEX-CMS/5',
        'tutorials/VTEX-CMS/6',
        'tutorials/VTEX-CMS/7',
      ],
    },
  ],
  howToGuidesSidebar: ['how-to-guides/overview'],
  conceptsSidebar: ['conceptual-guides/overview'],
  referenceSidebar: [
    'reference/overview',
    {
      type: 'category',
      label: 'UI',
      collapsed: false,
      items: [
        'reference/ui/overview',
        {
          type: 'category',
          label: 'Atoms',
          collapsed: false,
          items: [
            'reference/ui/atoms/Badge',
            'reference/ui/atoms/Button',
            'reference/ui/atoms/Checkbox',
            'reference/ui/atoms/Icon',
            'reference/ui/atoms/Input',
            'reference/ui/atoms/Label',
            'reference/ui/atoms/List',
            'reference/ui/atoms/Overlay',
            'reference/ui/atoms/Popover',
            'reference/ui/atoms/Price',
            'reference/ui/atoms/Radio',
            'reference/ui/atoms/Select',
            'reference/ui/atoms/Skeleton',
            'reference/ui/atoms/Slider',
            'reference/ui/atoms/Spinner',
            'reference/ui/atoms/TextArea',
          ],
        },
        {
          type: 'category',
          label: 'Molecules',
          collapsed: false,
          items: [
            'reference/ui/molecules/Accordion',
            'reference/ui/molecules/Breadcrumb',
            'reference/ui/molecules/Bullets',
            'reference/ui/molecules/Carousel',
            'reference/ui/molecules/Form',
            'reference/ui/molecules/IconButton',
            'reference/ui/molecules/LoadingButton',
            'reference/ui/molecules/Modal',
            'reference/ui/molecules/PriceRange',
            'reference/ui/molecules/RadioGroup',
            'reference/ui/molecules/SearchInput',
            'reference/ui/molecules/Table',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'SDK',
      collapsed: false,
          items: [
            'reference/sdk/overview',
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
            'reference/api/overview',       
      ],
    },
  ],
}
