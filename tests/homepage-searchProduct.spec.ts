import { test, expect } from '../src/utils/fixtures';
import {
  Environment,
  BaseTestParameters,
  TestDataSet,
  defineTestSuites,
} from '../src/utils/test-utils';

/**
 * ---------------------------------------------------------------------------------\
 * Define structure and description of parameters that should be passed to the test.\
 * ---------------------------------------------------------------------------------\
 */
interface TestParameters extends BaseTestParameters {
  readonly productName: string;
}

/**
 * -----------------------------------------------------------------------\
 * Define datasets and the according parameter data for each environment.  \
 * -----------------------------------------------------------------------\
 */
const DATA_SETS: Array<TestDataSet<TestParameters>> = [
  {
    environment: Environment.QA,
    parameters: [
      { productName: 'Album' },
      { productName: 'Hoodie with Zipper' },
      { productName: 'Cap' },
      { productName: 'Belt' },
      { productName: 'Hoodie with Logo' },
    ],
  },
];

/**
 * ------------------------------------------------------------------\
 * Define one or more {@link test()}s and their {@link test.step()}s.\
 * ------------------------------------------------------------------\
 */
function testSteps(data: TestParameters): void {
  test(
    `[${data.productName}]`,
    async ({ homepage, shoppingCart }) => {

      await test.step('Go to Shop', async () => {
        await homepage.goTo(data.environment);
      });
      await test.step(`Search for Product '${data.productName}' `, async () => {
        await homepage.actionTo.searchForProduct(data.productName);
      });
    }
  );
}

/* Defines a test suite for each dataset. */
defineTestSuites(testSteps, DATA_SETS);
