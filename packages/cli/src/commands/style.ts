import type { GluegunToolbox } from 'gluegun'

const faststoreThemes = {
  tailwind: '@vtex/theme-b2c-tailwind',

  // Fake theme for example
  fashion: '@vtex/theme-fashion',
  grocery: '@vtex/theme-grocery',
}

module.exports = {
  name: 'style',
  alias: ['s'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      prompt,
      print: { info },
      packageManager,
    } = toolbox

    const { theme } = await prompt.ask([
      {
        type: 'autocomplete',
        name: 'theme',
        message: 'Theme?',
        choices: Object.keys(faststoreThemes),
        suggest(s, choices) {
          return choices.filter((choice) => {
            return choice.message.toLowerCase().includes(s.toLowerCase())
          })
        },
      },
    ])

    info(`Installing ${theme} theme...`)

    await packageManager.add(faststoreThemes[theme], {
      dryRun: false,
    })
  },
}
