import { Page, expect } from '@playwright/test';
import { Environment } from '../utils/test-utils';

export class HomePage {
  readonly page: Page;
  readonly heading;
  readonly cartContents;
  readonly viewCartButton;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1.page-title, h1');
    this.cartContents = page.locator('a.cart-contents');
    this.viewCartButton = page.locator('a.added_to_cart.wc-forward');
  }

  async goTo(env: Environment = Environment.QA) {
    await this.page.goto(env);
  }

  checkThat = {
    shopNameIs: async (expected: string) => {
      await expect(this.heading).toBeVisible();
      await expect(this.heading).toHaveText(expected);
    },
    cartIsEmpty: async () => {
      await expect(this.cartContents).toBeVisible();
      const txt = await this.cartContents.textContent();
      expect(txt).toMatch(/0/);
    },
  };

  actionTo = {
    addProductToCart: async (productName: string) => {
      const btn = this.page.locator(
        `li.product:has(h2:has-text("${productName}")) a.add_to_cart_button`
      );
      await expect(btn).toBeVisible();
      await btn.click();
      await expect(this.viewCartButton).toBeVisible({ timeout: 5_000 });
    },
    goToCartViaAddProductToCart: async () => {
      await this.viewCartButton.click();
      await this.page.waitForURL(/\/cart\/?/);
    },
  };
}