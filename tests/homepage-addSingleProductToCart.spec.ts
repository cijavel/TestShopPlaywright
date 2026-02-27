import {
  test,
  expect,
} from '../src/utils/fixtures';
import {
  Environment,
  TestMetadata,
  BaseTestParameters,
  TestDataSet,
  defineTestSuites,
} from '../src/utils/test-utils';

/**
 * ----------------------------------------------------\
 * Define the general information about the whole test.\
 * ----------------------------------------------------\
 */
const META_DATA: TestMetadata = {
  name: "Homepage: add product to shopping cart",
  description: 'Add product to shopping cart on homepage',
  tags: ['@homepage', '@smoke'],
  testCase: 'Homepage-addSingleProductToCart',
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
    uniqueID: "" + META_DATA.testCase,
    parameters: [
      { shopHeading: 'Shop', quantity: 2, expectedTotalPrice: '30,00 €', productName: 'Album'},
      //{ shopHeading: 'Shop', quantity: 1, expectedTotalPrice: '45,00 €', productName: 'Hoodie with Zipper'},
      //{ shopHeading: 'Shop', quantity: 5, expectedTotalPrice: '80,00 €', productName: 'Cap' },
      //{ shopHeading: 'Shop', quantity: 1, expectedTotalPrice: '55,00 €', productName: 'Belt'},
      //{ shopHeading: 'Shop', quantity: 3, expectedTotalPrice: '135,00 €', productName: 'Hoodie with Logo'},
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
  test(
    `[${data.productName}]`,
    async ({ homepage, shoppingCart }) => {
      await test.step('Go to Shop', async () => {
        await homepage.goTo();
      });
      await test.step(`Check shop name '${data.shopHeading}'`, async () => {
        await homepage.checkThat.shopNameIs(data.shopHeading);
      });
      await test.step('Check that cart is empty', async () => {
        await homepage.checkThat.cartIsEmpty();
      });
      await test.step(`Add Product '${data.productName}' on homepage to cart`,async () => {
          await homepage.actionTo.addProductToCart(data.productName);
        }
      );
      await test.step('Go to cart via add product to cart', async () => {
        await homepage.actionTo.goToCartViaAddProductToCart();
      });

      await test.step(`Change quantity of product '${data.productName}' to '${data.quantity}'`, async () => {
          await shoppingCart.actionTo.changeProductQuantityTo(data.productName, data.quantity);
          await shoppingCart.actionTo.updateCart();
        }
      );

      await test.step(
        `Verify total price of '${data.expectedTotalPrice}'`,async () => {
          await shoppingCart.checkThat.totalPriceIs(data.expectedTotalPrice);
          await shoppingCart.checkThat.compareTotalPriceWithCalculatedTotalPriceOfSubtotals();
        }
      );

      await test.step('Empty cart', async () => {
        await shoppingCart.actionTo.emptyCart();
      });

      await test.step('Verify cart empty message is shown', async () => {
        await shoppingCart.checkThat.cartIsEmptyMessageIsVisible();
      });

    }
  );
}

/* Defines a test suite for each dataset.*/
defineTestSuites(testSteps, META_DATA, DATA_SETS);