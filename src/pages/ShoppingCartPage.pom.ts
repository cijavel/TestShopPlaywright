import { expect, Locator, Page } from '@playwright/test';

/**
 * Page object for the shopping cart page (/cart/).
 * Encapsulates operations that can be performed once the user is viewing the cart.
 */
export class ShoppingCartPage {
  readonly page: Page;
  readonly totalPriceLocator: Locator;
  readonly subtotalLocators: Locator;
  readonly updateCartButton: Locator;
  readonly removeLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalPriceLocator = page.locator('.order-total .amount');
    this.subtotalLocators = page.locator('td.product-subtotal .amount');
    this.updateCartButton = page.locator('text=Update cart');
    this.removeLinks = page.locator('.remove');
  }

  /**
   * grouped helpers for actions/commands
   */
  // helper functions for dynamic locators
  cartRow(productName: string): Locator {
    return this.page.locator('tr').filter({ hasText: productName });
  }

  quantityInput(productName: string): Locator {
    return this.cartRow(productName).locator('input.qty');
  }

  readonly actionTo = {
    changeProductQuantityTo: async (productName: string, quantity: number): Promise<void> => {
      const row = this.cartRow(productName);
      await expect(row).toBeVisible({ timeout: 5000 });
      await this.quantityInput(productName).fill(quantity.toString());
    },
    updateCart: async (): Promise<void> => {
      await this.updateCartButton.click();
    },
    emptyCart: async (): Promise<void> => {
      const count = await this.removeLinks.count();
      for (let i = 0; i < count; i++) {
        // always click the first one since the list updates after each removal
        await this.removeLinks.first().click();
        // wait a little for the row to disappear
        await this.page.waitForTimeout(500);
      }
    },
  };

  /**
   * grouped helpers for assertions
   */
  readonly checkThat = {
    totalPriceIs: async (expected: string): Promise<void> => {
      await expect(this.totalPriceLocator).toHaveText(expected);
    },
    compareTotalPriceWithCalculatedTotalPriceOfSubtotals: async (): Promise<void> => {
      const rawSubtotals = await this.subtotalLocators.allInnerTexts();
      const numbers = rawSubtotals.map(text =>
        parseFloat(
          text.replace(/[^0-9,\.]/g, '').replace(',', '.')
        )
      );
      const sum = numbers.reduce((a, b) => a + b, 0);
      const rawTotal = await this.totalPriceLocator.innerText();
      const totalNum = parseFloat(rawTotal.replace(/[^0-9,\.]/g, '').replace(',', '.'));
      expect(totalNum).toBeCloseTo(sum, 2);
    },
  };
}
