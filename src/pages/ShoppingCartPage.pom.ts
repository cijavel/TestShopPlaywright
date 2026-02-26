import { Page, expect } from '@playwright/test';
import { parsePrice } from '../utils/test-helpers';

export class ShoppingCartPage {
  readonly page: Page;
  readonly updateCartButton;
  readonly totalPriceLocator;

  constructor(page: Page) {
    this.page = page;
    this.updateCartButton = page.locator('button[name="update_cart"]');
    this.totalPriceLocator = page.locator('.order-total .amount');
  }

  actionTo = {
    changeProductQuantityTo: async (productName: string, qty: number) => {
      const row = this.page.locator('tr.cart_item', { hasText: productName });
      const input = row.locator('input.qty');
      await input.fill(qty.toString());
    },
    updateCart: async () => {
      await this.updateCartButton.click();
      await this.page.waitForLoadState('networkidle');
    },
    emptyCart: async () => {
      const removeBtns = this.page.locator('a.remove');
      while ((await removeBtns.count()) > 0) {
        await removeBtns.first().click();
        await this.page.waitForLoadState('networkidle');
      }
    },
  };

  checkThat = {
    totalPriceIs: async (expected: string) => {
      await expect(this.totalPriceLocator).toHaveText(expected);
    },
    compareTotalPriceWithCalculatedTotalPriceOfSubtotals: async () => {
      const subs = this.page.locator(
        'td.product-subtotal .woocommerce-Price-amount'
      );
      let sum = 0;
      for (let i = 0, n = await subs.count(); i < n; i++) {
        const t = await subs.nth(i).textContent();
        if (t) sum += parsePrice(t);
      }
      const totTxt = (await this.totalPriceLocator.textContent()) ?? '0';
      const tot = parsePrice(totTxt);
      expect(sum).toBeCloseTo(tot, 2);
    },
  };
}