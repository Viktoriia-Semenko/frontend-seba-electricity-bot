const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  setupFiles: ['./jest.setup.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json'
      }
    ]
  },
};