import { Page, expect } from '@playwright/test';
import { parsePrice } from '../utils/test-helpers';

export class ShoppingCartPage {
  readonly page: Page;
  readonly updateCartButton;
  readonly totalPriceLocator;
  readonly subtotalPriceLocators;
  readonly cartItemRows;
  readonly removeButtons;
  readonly cartEmptyMessage;

  constructor(page: Page) {
    this.page = page;
    this.updateCartButton = page.locator('button[name="update_cart"]');
    this.totalPriceLocator = page.locator('.order-total .amount');
    this.subtotalPriceLocators = page.locator('td.product-subtotal .woocommerce-Price-amount');
    this.cartItemRows = page.locator('tr.cart_item');
    this.removeButtons = page.locator('a.remove');
    this.cartEmptyMessage = page.locator('div.cart-empty');
  }

  actionTo = {
    changeProductQuantityTo: async (productName: string, qty: number) => {
      const row = this.cartItemRows.filter({ hasText: productName });
      const input = row.locator('input.qty');
      await input.fill(qty.toString());
    },
    updateCart: async () => {
      await this.updateCartButton.click();
      await this.page.waitForLoadState('networkidle');
    },
    emptyCart: async () => {
      // remove items by navigating to the remove link to avoid overlay/blockUI
      while ((await this.removeButtons.count()) > 0) {
        const first = this.removeButtons.first();
        const href = await first.getAttribute('href');
        if (href) {
          await this.page.goto(href);
          await this.page.waitForLoadState('networkidle');
        } else {
          // fallback to force click if no href
          await first.click({ force: true });
          await this.page.waitForLoadState('networkidle');
        }
      }
    },
  };

  checkThat = {
    totalPriceIs: async (expected: string) => {
      await expect(this.totalPriceLocator).toHaveText(expected);
    },
    cartIsEmptyMessageIsVisible: async () => {
      await expect(this.cartEmptyMessage).toBeVisible();
      await expect(this.cartEmptyMessage).toHaveText('Your cart is currently empty.');
    },
    compareTotalPriceWithCalculatedTotalPriceOfSubtotals: async () => {
      let sum = 0;
      for (let i = 0, n = await this.subtotalPriceLocators.count(); i < n; i++) {
        const t = await this.subtotalPriceLocators.nth(i).textContent();
        if (t) sum += parsePrice(t);
      }
      const totTxt = (await this.totalPriceLocator.textContent()) ?? '0';
      const tot = parsePrice(totTxt);
      expect(sum).toBeCloseTo(tot, 2);
    },
  };
}