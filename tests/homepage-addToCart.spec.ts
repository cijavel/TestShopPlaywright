import { test, expect } from '../src/utils/fixtures';
import { defineTestSuites, Environment, BaseTestParameters, TestDataSet, TestMetadata } from '../src/utils/test-utils';

/**
 * ----------------------------------------------------\
 * Define the general information about the whole test.\
 * ----------------------------------------------------\
 */
const META_DATA: TestMetadata = {
  name: "'Homepage: add product to shopping cart",
  description: 'Add product to shopping cart on homepage',
  tags: ['@homepage', '@smoke'],
};

/**
 * ---------------------------------------------------------------------------------\
 * Define structure and description of parameters that should be passed to the test.\
 * ---------------------------------------------------------------------------------\
 */
interface TestParameters extends BaseTestParameters {
  readonly shopHeading: string;
  readonly productName: string;
  readonly quantity: number;
  readonly expectedTotalPrice: string;
}

/**
 * ----------------------------------------------------------------------\
 * Define datasets and the according parameter data for each environment.\
 * ----------------------------------------------------------------------\
 */
const DATA_SETS: Array<TestDataSet<TestParameters>> = [
  {
    environment: Environment.QA,
    uniqueID: META_DATA.name, // max 50 characters
    parameters: [
      { shopHeading: 'Shop', productName: 'Album', quantity: 2, expectedTotalPrice: '30,00 €' },
    ],
  },
];

/**
 * ------------------------------------------------------------------\
 * Define one or more {@link test()}s and their {@link test.step()}s.\
 * ------------------------------------------------------------------\
 * @param data the {@link TestParameters} you defined above.
 */
function testSteps(data: TestParameters): void {
  test(`[${data.productName}]`, async ({ homepage, shoppingCart }) => {
    await test.step('Go to Shop', async () => {
      await homepage.goTo();
    });

    await test.step(`Check shop name '${data.shopHeading}'`, async () => {
      await homepage.checkThatShopNameIs(data.shopHeading);
    });

    await test.step('Check that cart is empty', async () => {
      await homepage.checkThatCartIsEmpty();
    });

    await test.step(`Add Product '${data.productName}' on homepage to cart`, async () => {
      await homepage.addProductToCart(data.productName);
    });

    await test.step('Go to cart via add product to cart', async () => {
      await homepage.goToCartViaAddProductToCart();
    });

    await test.step(`Change quantity of product '${data.productName}' to '${data.quantity}'`, async () => {
      await shoppingCart.changeProductQuantityTo(data.productName, data.quantity);
      await shoppingCart.updateCart();
    });

    await test.step(`Verify total price of '${data.expectedTotalPrice}'`, async () => {
      await shoppingCart.totalPriceIs(data.expectedTotalPrice);
      await shoppingCart.compareTotalPriceWithCalculatedTotalPriceOfSubtotals();
    });

    await test.step('Go to cart via the minicart', async () => {
      await shoppingCart.emptyCart(); // clean up
    });
  });
}

/* Defines a test suite for each dataset.*/
defineTestSuites(testSteps, META_DATA, DATA_SETS);
