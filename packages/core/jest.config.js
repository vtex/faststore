/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...require('../../jest.config.js'),
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
}
