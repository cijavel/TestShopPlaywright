import { test } from '../src/utils/fixtures';
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
  readonly productName:        string;
  readonly expectedPrice:      string;
}

/**
 * ----------------------------------------------------------------------\
 * Define datasets and the according parameter data for each environment.\
 * ----------------------------------------------------------------------\
 */
const DATA_SETS: Array<TestDataSet<TestParameters>> = [
  {
    environment: Environment.QA,
    parameters: [
      { productName: 'Album',             expectedPrice: '15,00 €' },
      { productName: 'Hoodie with Zipper', expectedPrice: '45,00 €' },
      { productName: 'Cap',               expectedPrice: '16,00 €' },
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
    async ({ homepage, productDetailPage }) => {

      await test.step('Go to Shop', async () => {
        await homepage.goTo(data.environment);
      });

      await test.step(`Search for Product '${data.productName}'`, async () => {
        await homepage.actionTo.searchForProduct(data.productName);
      });

      await test.step(`Verify on Product Detail Page for '${data.productName}'`, async () => {
        await productDetailPage.checkThat.isOnProductDetailPage();
      });

      await test.step(`Verify product title is '${data.productName}'`, async () => {
        await productDetailPage.checkThat.productTitleIs(data.productName);
      });

      await test.step(`Verify product price is '${data.expectedPrice}'`, async () => {
        await productDetailPage.checkThat.productPriceIs(data.expectedPrice);
      });

      await test.step('Verify short description is visible', async () => {
        await productDetailPage.checkThat.shortDescriptionIsVisible();
      });

      await test.step('Verify long description is visible', async () => {
        await productDetailPage.checkThat.longDescriptionIsVisible();
      });

      await test.step('Verify product image is visible', async () => {
        await productDetailPage.checkThat.productImageIsVisible();
      });
    }
  );
}

/* Defines a test suite for each dataset. */
defineTestSuites(testSteps, DATA_SETS);
