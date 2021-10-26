// File created to resolve .graphql files.
// The main content was extracted from https://github.com/formium/tsdx/blob/master/src/createJestConfig.ts
// Copying some code was necessary because tsdx does shallow merges

module.exports = {
  preset: 'ts-jest',
  transform: {
    '.(graphql)$': 'jest-transform-graphql',
    '.(js|jsx)$': 'babel-jest', // jest's default
  },
}
