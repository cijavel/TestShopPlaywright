import { test, expect } from '@playwright/test';

export enum Environment {
  QA   = 'QA',
  PROD = 'PROD',
}

export const EnvironmentUrls: Record<Environment, string> = {
  [Environment.QA]:   'https://autoprojekt.simplytest.de/',
  [Environment.PROD]: 'http://google.de',
};


export interface BaseTestParameters {
  readonly environment?: Environment;
}

export interface TestDataSet<T extends BaseTestParameters> {
  environment: Environment;
  parameters: T[];
}

export function defineTestSuites<T extends BaseTestParameters>(
  testSteps: (data: T) => void,
  dataSets: Array<TestDataSet<T>>
) {
  dataSets.forEach((ds) => {
    test.describe(ds.environment, () => {
      ds.parameters.forEach((params) => {
        const paramsWithEnv: T = {
          ...params,
          environment: ds.environment,
        } as T;
        testSteps(paramsWithEnv);
      });
    });
  });
}

export { expect };
