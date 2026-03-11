import { Page, Locator, expect } from '@playwright/test';
import { Environment, EnvironmentUrls } from '../utils/test-utils';

export class HomePage {
  readonly page: Page;


  readonly homepage:   { 
    heading: Locator;
  };

  readonly productLocators: {
    productItems:    Locator;
    addToCartButton: string;
  };

  readonly cartLocators: {
    cartContents:   Locator;
    viewCartButton: Locator;
  };

  readonly searchLocators: {
    searchInput:   Locator;
    searchButton:  Locator;
    searchResults: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.homepage = {
      heading: page.locator('h1.page-title, h1'),
    };

    this.productLocators = {
      productItems:    page.locator('li.product'),
      addToCartButton: 'a.add_to_cart_button',
    };

    this.cartLocators = {
      cartContents:   page.locator('a.cart-contents'),
      viewCartButton: page.locator('a.added_to_cart.wc-forward'),
    };

    this.searchLocators = {
      searchInput:   page.locator('input#woocommerce-product-search-field-0'),
      searchButton:  page.locator('button[type="submit"]'),
      searchResults: page.locator('ul.products'),
    };
  }

  async goTo(env: Environment = Environment.QA) {
    await this.page.goto(EnvironmentUrls[env]);
  }

  checkThat = {
    shopNameIs: async (expectedShopHeading: string) => {
      await expect(this.homepage.heading).toBeVisible();
      await expect(this.homepage.heading).toHaveText(expectedShopHeading);
    },

    cartIsEmpty: async () => {
      await expect(this.cartLocators.cartContents).toBeVisible();
      const cartText = await this.cartLocators.cartContents.textContent();
      expect(cartText).toMatch(/0/);
    },
  };

  actionTo = {
    addProductToCart: async (productName: string) => {
      const addToCartButton = this.productLocators.productItems
        .filter({ hasText: productName })
        .locator(this.productLocators.addToCartButton);
      await expect(addToCartButton).toBeVisible();
      await addToCartButton.click();
      await expect(this.cartLocators.viewCartButton).toBeVisible({ timeout: 5_000 });
    },

    goToCartViaAddProductToCart: async () => {
      await this.cartLocators.viewCartButton.click();
      await this.page.waitForURL(/\/cart\/?/);
    },

    searchForProduct: async (searchText: string) => {
      await this.searchLocators.searchInput.fill(searchText);
      await this.page.keyboard.press('Enter');
    },
  };
}