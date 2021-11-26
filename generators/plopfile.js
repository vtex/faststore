module.exports = function (plop) {
  plop.setGenerator('component', {
    description: 'Create a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your component name?',
      },
      {
        type: 'list',
        name: 'atomicType',
        message: 'What is your component atomic type?',
        choices: ['atom', 'molecule', 'organism'],
      },
    ],
    actions: [
      {
        type: 'add',
        path:
          '../packages/ui/src/{{atomicType}}s/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'templates/Component.tsx.hbs',
      },
      {
        type: 'add',
        path:
          '../packages/ui/src/{{atomicType}}s/{{pascalCase name}}/index.tsx',
        templateFile: 'templates/index.tsx.hbs',
      },
      {
        type: 'add',
        path:
          '../themes/theme-b2c-tailwind/src/{{atomicType}}s/{{kebabCase name}}.css',
      },
    ],
  })
}
