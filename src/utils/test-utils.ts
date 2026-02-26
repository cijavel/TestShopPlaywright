import { test, expect } from '@playwright/test';

export enum Environment {
  QA = 'https://autoprojekt.simplytest.de/',
}

export interface BaseTestParameters {
  readonly shopHeading?: string;
  readonly productName?: string;
  readonly quantity?: number;
  readonly expectedTotalPrice?: string;
  readonly environment?: Environment;
}

export interface TestMetadata {
  name: string;
  description: string;
  tags: string[];
  testCase?: string;
}

export interface TestDataSet<T> {
  environment: Environment;
  uniqueID: string;
  parameters: T[];
}

export function defineTestSuites<T extends BaseTestParameters>(
  testSteps: (data: T) => void,
  meta: TestMetadata,
  dataSets: Array<TestDataSet<T>>
) {
  dataSets.forEach((ds) => {
    ds.parameters.forEach((params) => {
      testSteps(params as T);
    });
  });
}

export function parsePrice(text: string): number {
  const cleaned = text.replace(/[^\d,.-]/g, '').replace(',', '.');
  return parseFloat(cleaned);
}

export { expect };