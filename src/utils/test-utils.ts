import { expect } from '@playwright/test';

export enum Environment {
  QA   = 'https://autoprojekt.simplytest.de/',
  PROD = 'https://autoprojekt.simplytest.de/',
}

export interface BaseTestParameters {
  readonly shopHeading?: string;
  readonly productName?: string;
  readonly quantity?: number;
  readonly expectedTotalPrice?: string;
  readonly environment?: Environment;
}

export interface TestDataSet<T> {
  environment: Environment;
  parameters: T[];
}

export function defineTestSuites<T extends BaseTestParameters>(
  testSteps: (data: T) => void,
  dataSets: Array<TestDataSet<T>>
) {
  dataSets.forEach((ds) => {
    ds.parameters.forEach((params) => {
      const paramsWithEnv: T = {
        ...params,
        environment: ds.environment,
      } as T;
      testSteps(paramsWithEnv);
    });
  });
}

export { expect };
