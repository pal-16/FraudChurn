import { cleanEnv, str } from 'envalid';

import AbstractService from './service';
import logger from './logger';

export type EnvVariables = {
  NODE_ENV: string;
  PORT: string;
  PGHOST: string;
  PGDATABASE: string;
  PGUSER: string;
  PGPASSWORD: string;
  PGPORT: string;
  AWS_KEY: string;
  AWS_SECRET: string;
  AWS_QUEUE: string;
  AWS_REGION: string;
  PRIVATE_KEY: string;
  PUBLIC_KEY: string;
  CHAINSAFE_KEY_ID: string;
  CHAINSAFE_KEY_SECRET: string;
  CHAINSAFE_BUCKET_URL: string;
};

class EnvService implements AbstractService {
  static envVariables = {
    NODE_ENV: str({
      choices: ['development', 'staging', 'test', 'production'],
    }),
    PORT: str(),
    PGHOST: str(),
    PGDATABASE: str(),
    PGUSER: str(),
    PGPASSWORD: str(),
    PGPORT: str(),
    AWS_KEY: str(),
    AWS_SECRET: str(),
    AWS_QUEUE: str(),
    AWS_REGION: str(),
    PRIVATE_KEY: str(),
    PUBLIC_KEY: str(),
    CHAINSAFE_KEY_ID: str(),
    CHAINSAFE_KEY_SECRET: str(),
    CHAINSAFE_BUCKET_URL: str(),
  };

  static envs: Readonly<EnvVariables>;

  static init(): void {
    this.envs = cleanEnv(process.env, EnvService.envVariables, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reporter: ({ errors }: { errors: any }) => {
        if (Object.keys(errors).length > 0) {
          // TODO(ankit): If we use github actions & AWS Secret manager, prompt the dev to change the json file with secrets.
          logger.error(`Invalid env vars: ${Object.keys(errors)}`);
        }
      },
    });
    logger.info(`Loaded env and running in env ${process.env['NODE_ENV']}`);
  }

  static env(): Readonly<EnvVariables> {
    return this.envs;
  }
}

export default EnvService;
