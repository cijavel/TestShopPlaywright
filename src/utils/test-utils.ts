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
  readonly uniqueID?: string;
}

export interface TestDataSet<T> {
  environment: Environment;
  uniqueID: string;
  parameters: T[];
}

export function defineTestSuites<T extends BaseTestParameters>(
  testSteps: (data: T) => void,
  dataSets: Array<TestDataSet<T>>
) {
  dataSets.forEach((ds) => {
    ds.parameters.forEach((params) => {
      const paramsWithMeta = {
        ...params,
        environment: ds.environment,
        uniqueID: ds.uniqueID,
      };
      testSteps(paramsWithMeta as T);
    });
  });
}

export { expect };
