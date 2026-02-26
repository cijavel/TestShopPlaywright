import { expect, Locator, Page } from '@playwright/test';

/**
 * Page object for the shop homepage.
 * Contains actions and assertions that can be performed on the public shop page.
 */
export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly miniCartIndicator: Locator;
  readonly viewCartLink: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // static locators
    this.heading = page.locator('h1');
    // the top‑right cart indicator that shows total & item count
    this.miniCartIndicator = page.locator('a[href$="/cart/"]');
    this.viewCartLink = page.locator('text=View cart');
    this.emptyCartMessage = page.locator('text=No products in the cart.');
  }

  /**
   * navigate to the root of the shop. baseURL is assumed to be configured in Playwright.
   */
  async goTo(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * accessor used by some check helpers
   */
  async getHeadingText(): Promise<string> {
    return this.heading.innerText();
  }

  /**
   * grouped helpers for assertions
   */
  readonly checkThat = {
    shopNameIs: async (expected: string): Promise<void> => {
      await expect(this.heading).toHaveText(expected, { timeout: 5000 });
    },
    cartIsEmpty: async (): Promise<void> => {
      // the message appears in the mini‑cart indicator and on the cart page
      await expect(this.emptyCartMessage).toBeVisible();
    },
  };

  /**
   * grouped helpers for actions/commands
   */
  // helper functions for dynamic locators
  productCard(productName: string): Locator {
    return this.page.locator('article').filter({ hasText: productName });
  }

  addToCartButton(productName: string): Locator {
    return this.productCard(productName).locator('text=Add to cart').first();
  }

  readonly actionTo = {
    addProductToCart: async (productName: string): Promise<void> => {
      const card = this.productCard(productName);
      await expect(card).toBeVisible({ timeout: 5000 });
      await this.addToCartButton(productName).click();
    },
    goToCartViaAddProductToCart: async (): Promise<void> => {
      await expect(this.viewCartLink).toBeVisible({ timeout: 5000 });
      await this.viewCartLink.click();
    },
  };
}
