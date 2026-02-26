import { expect, Locator, Page } from '@playwright/test';

/**
 * Page object for the shop homepage.
 * Contains actions and assertions that can be performed on the public shop page.
 */
export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly miniCartIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1');
    // the top‑right cart indicator that shows total & item count
    this.miniCartIndicator = page.locator('a[href$="/cart/"]');
  }

  /**
   * navigate to the root of the shop. baseURL is assumed to be configured in Playwright.
   */
  async goTo(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * retrieve the visible shop heading text (usually "Shop").
   */
  async getHeadingText(): Promise<string> {
    return this.heading.innerText();
  }

  /**
   * assertion helper that the heading matches expectation.
   */
  async checkThatShopNameIs(expected: string): Promise<void> {
    await expect(this.heading).toHaveText(expected, { timeout: 5000 });
  }

  /**
   * assertion that the cart is currently empty (no items).
   * relies on the text that WooCommerce renders when empty.
   */
  async checkThatCartIsEmpty(): Promise<void> {
    // the message appears in the mini‑cart indicator and on the cart page
    await expect(this.page.locator('text=No products in the cart.')).toBeVisible();
  }

  /**
   * Add a product by name (e.g. "Album") using the add‑to‑cart button
   * that sits on the product card on the shop page.
   */
  async addProductToCart(productName: string): Promise<void> {
    const card = this.page.locator('article').filter({ hasText: productName });
    await expect(card).toBeVisible({ timeout: 5000 });
    await card.locator('text=Add to cart').first().click();
  }

  /**
   * after adding a product an overlay appears with a "View cart" link
   * this helper waits for it and clicks through.
   */
  async goToCartViaAddProductToCart(): Promise<void> {
    const viewCart = this.page.locator('text=View cart');
    await expect(viewCart).toBeVisible({ timeout: 5000 });
    await viewCart.click();
  }
}
