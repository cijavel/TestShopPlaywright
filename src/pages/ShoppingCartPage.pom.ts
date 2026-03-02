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
  readonly quantityInputLocator;

  constructor(page: Page) {
    this.page = page;
    this.updateCartButton = page.locator('button[name="update_cart"]');
    this.totalPriceLocator = page.locator('.order-total .amount');
    this.subtotalPriceLocators = page.locator('td.product-subtotal .woocommerce-Price-amount');
    this.cartItemRows = page.locator('tr.cart_item');
    this.removeButtons = page.locator('a.remove');
    this.cartEmptyMessage = page.locator('div.cart-empty');
    this.quantityInputLocator = 'input.qty';
  }

  actionTo = {
    changeProductQuantityTo: async (productName: string, quantity: number) => {
      const row = this.cartItemRows.filter({ hasText: productName });
      const input = row.locator(this.quantityInputLocator);
      await input.fill(quantity.toString());
    },

    updateCart: async () => {
      await this.page.waitForLoadState('networkidle');
      await this.updateCartButton.click();
      await this.page.waitForLoadState('networkidle');
    },
  };

  checkThat = {
    totalPriceIs: async (expected: string) => {
      await expect(this.totalPriceLocator).toHaveText(expected);
    },

    compareTotalPriceWithCalculatedTotalPriceOfSubtotals: async () => {
      let sum = 0;
      for (let index = 0, count = await this.subtotalPriceLocators.count(); index < count; index++) {
        const subtotalText = await this.subtotalPriceLocators.nth(index).textContent();
        if (subtotalText) sum += parsePrice(subtotalText);
      }
      const totalPriceText = (await this.totalPriceLocator.textContent()) ?? '0';
      const totalPrice  = parsePrice(totalPriceText);
      expect(sum).toBeCloseTo(totalPrice, 2);
    },
  };
}