import { test } from './fixtures';

/**
 * a small enumeration used by the example data‑set structure.  Add more
environments if needed.
 */
export enum Environment {
  QA = 'qa',
  DEV = 'dev',
  PROD = 'prod',
}

export interface BaseTestParameters {
  readonly uniqueID?: string;
  readonly environment?: Environment;
}

/**
 * wrapper around a set of parameter objects that are executed as a group.
 */
export interface TestDataSet<T extends BaseTestParameters> {
  environment: Environment;
  uniqueID: string;
  parameters: Array<T>;
}

/**
 * Metadata about a test or group of tests.  The fragment is mostly cosmetic
 * but can be used to tag or describe tests in reports.
 */
export interface TestMetadata {
  name: string;
  description?: string;
  tags?: string[];
  testCase?: string;
}

/**
 * helper that iterates over each dataset and calls the provided `testSteps`
 * function inside its own `describe` block.  The function you pass should
 * itself declare `test()`-based tests; this indirection allows us to keep
 * dataset logic separate from the actual business steps.
 */
export function defineTestSuites<T extends BaseTestParameters>(
  testSteps: (data: T) => void,
  meta: TestMetadata,
  dataSets: Array<TestDataSet<T>>
) {
  for (const ds of dataSets) {
    test.describe(`${meta.name} [${ds.uniqueID}]`, () => {
      for (const params of ds.parameters) {
        testSteps(params as T);
      }
    });
  }
}
