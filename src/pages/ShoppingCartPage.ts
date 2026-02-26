import { expect, Locator, Page } from '@playwright/test';

/**
 * Page object for the shopping cart page (/cart/).
 * Encapsulates operations that can be performed once the user is viewing the cart.
 */
export class ShoppingCartPage {
  readonly page: Page;
  readonly totalPriceLocator: Locator;
  readonly subtotalLocators: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalPriceLocator = page.locator('.order-total .amount');
    this.subtotalLocators = page.locator('td.product-subtotal .amount');
  }

  /**
   * change the quantity of a given product in the cart table
   */
  async changeProductQuantityTo(productName: string, quantity: number): Promise<void> {
    const row = this.page.locator('tr').filter({ hasText: productName });
    await expect(row).toBeVisible({ timeout: 5000 });
    const qtyInput = row.locator('input.qty');
    await qtyInput.fill(quantity.toString());
  }

  async updateCart(): Promise<void> {
    await this.page.locator('text=Update cart').click();
  }

  async totalPriceIs(expected: string): Promise<void> {
    await expect(this.totalPriceLocator).toHaveText(expected);
  }

  /**
   * sanity check: add up all of the subtotal values and compare
   * with the displayed total. This helps catch calculation bugs.
   */
  async compareTotalPriceWithCalculatedTotalPriceOfSubtotals(): Promise<void> {
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
  }

  /**
   * remove all items from the cart by clicking each "×"/remove link.
   * this is useful when cleaning up between tests.
   */
  async emptyCart(): Promise<void> {
    const removeLinks = this.page.locator('.remove');
    const count = await removeLinks.count();
    for (let i = 0; i < count; i++) {
      // always click the first one since the list updates after each removal
      await removeLinks.first().click();
      // wait a little for the row to disappear
      await this.page.waitForTimeout(500);
    }
  }
}
