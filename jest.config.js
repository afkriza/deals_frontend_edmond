module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleNameMapper: {
    '^classes(.*)$': '<rootDir>/src/classes$1',
    '^components(.*)$': '<rootDir>/src/components$1',
    '^config(.*)$': '<rootDir>/src/config$1',
    '^constants(.*)$': '<rootDir>/src/constants$1',
    '^databases(.*)$': '<rootDir>/src/databases$1',
    '^directives(.*)$': '<rootDir>/src/directives$1',
    '^enums(.*)$': '<rootDir>/src/enums$1',
    '^layouts(.*)$': '<rootDir>/src/layouts$1',
    '^mixins(.*)$': '<rootDir>/src/mixins$1',
    '^models(.*)$': '<rootDir>/src/models$1',
    '^pages(.*)$': '<rootDir>/src/pages$1',
    '^router(.*)$': '<rootDir>/src/router$1',
    '^api(.*)$': '<rootDir>/src/api$1',
    '^store(.*)$': '<rootDir>/src/store$1',
    '^utils(.*)$': '<rootDir>/src/utils$1',
    '^mocks(.*)$': '<rootDir>/tests/unit/mocks$1',
    '^helpers(.*)$': '<rootDir>/tests/unit/helpers$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/unit/mocks/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/tests/unit/mocks/styleMock.js'
  }
};
