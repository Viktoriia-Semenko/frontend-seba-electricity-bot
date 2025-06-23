const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
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
    setupFiles: ['jest-localstorage-mock']
};