require('dotenv').config({ path: '.env' });

module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.+(js|jsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
      '!src/**/*.test.js?(x)',
      'config/jest/*.js',
    ],

    tests: ['src/**/*.test.js?(x)'],

    env: {
      type: 'node',
      runner: 'node',
    },

    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel({}),
    },

    setup: (wallaby) => {
      const jestConfig = require('./package.json').jest;
      if (jestConfig.setupTestFrameworkScriptFile) {
        jestConfig.setupTestFrameworkScriptFile = jestConfig.setupTestFrameworkScriptFile.replace('<rootDir>', wallaby.projectCacheDir);
      }

      delete jestConfig.transform['^.+\\.(js|jsx)$'];
      delete jestConfig.testEnvironment;
      wallaby.testFramework.configure(jestConfig);
    },

    testFramework: 'jest',
  };
};
