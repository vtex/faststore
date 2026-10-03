// This is a placeholder file for when starter files are copied here
module.exports = {
  llms: {
    enabled: true,
    title: 'FastStore Demo',
    tagline: 'Local /llms.txt smoke test.',
    about:
      'This is a local FastStore development server used to verify the /llms.txt PoC.',
    contact: {
      email: 'demo@faststore.local',
      url: 'https://faststore.local/contact',
    },
    customSections: [
      {
        title: 'Shop by category',
        items: [
          {
            name: 'Office',
            url: '/office',
            description: 'Office supplies and accessories.',
          },
          {
            name: 'Technology',
            url: '/technology',
            description: 'Phones, monitors, and peripherals.',
          },
        ],
      },
    ],
    institutionalSlugs: [],
    maxLinksPerSection: 25,
  },
}
