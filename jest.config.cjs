/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/scripts'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          experimentalDecorators: true,
          useDefineForClassFields: false,
          lib: ['ES2022', 'DOM'],
          strict: true,
          skipLibCheck: true,
          resolveJsonModule: true,
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
        },
        diagnostics: false,
        useESM: false,
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(lit|@lit|lit-html|lit-element)/)'],
  extensionsToTreatAsEsm: [],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/.storybook/utils/styleMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/.storybook/utils/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

module.exports = config;
