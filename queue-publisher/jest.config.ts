import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    silent: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    }
};

export default config;