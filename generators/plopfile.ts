import type { NodePlopAPI } from 'plop'

export default (plop: NodePlopAPI) => {
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
        name: 'atomicGroup',
        message: 'What is your component atomic group?',
        choices: ['atoms', 'molecules', 'organisms'],
      },
    ],
    actions(data) {
      const actions = [
        {
          type: 'add',
          path: '../packages/ui/src/{{atomicGroup}}/{{pascalCase name}}/{{pascalCase name}}.tsx',
          templateFile: 'templates/Component.tsx.hbs',
        },
        {
          type: 'add',
          path: '../packages/ui/src/{{atomicGroup}}/{{pascalCase name}}/index.tsx',
          templateFile: 'templates/index.tsx.hbs',
        },
        {
          type: 'add',
          path: '../packages/styles/src/{{atomicGroup}}/{{kebabCase name}}.css',
          templateFile: 'templates/style.css.hbs',
        },
        {
          type: 'add',
          path: '../packages/ui/src/{{atomicGroup}}/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
          templateFile: 'templates/test.tsx.hbs',
        },
      ]

      actions.push({
        type: 'append',
        path: '../packages/ui/src/index.ts',
        pattern: new RegExp(`// ${data?.atomicGroup}`, 'i'),
        templateFile: 'templates/exportToIndex.hbs',
      } as any)

      return actions
    },
  })
}
