import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleNameMapper: {
    '^@src(.*)$': '<rootDir>/src$1'
  },
  transform: {
    '^.+\\.spec\\.ts?$': 'ts-jest'
  }
};

export default config;
