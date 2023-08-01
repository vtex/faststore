/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/', 'cypress/'],
  modulePaths: ['<rootDir>/test'],
}
