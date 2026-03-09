import { Page, Locator, expect } from '@playwright/test';
import { parsePrice } from '../utils/test-helpers';

export class ShoppingCartPage {
  readonly page: Page;

  readonly productLocators: {
    cartItemRows:    Locator;
    removeButtons:   Locator;
    quantityInput:   string;
  };

  readonly priceLocators: {
    totalPrice:      Locator;
    subtotalPrices:  Locator;
  };

  readonly cartLocators: {
    updateCartButton: Locator;
  };

  readonly statusLocators: {
    cartEmptyMessage: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.productLocators = {
      cartItemRows:     page.locator('tr.cart_item'),
      removeButtons:    page.locator('a.remove'),
      quantityInput:    'input.qty',
    };

    this.priceLocators = {
      totalPrice:       page.locator('.order-total .amount'),
      subtotalPrices:   page.locator('td.product-subtotal .woocommerce-Price-amount'),
    };

    this.cartLocators = {
      updateCartButton: page.locator('button[name="update_cart"]'),
    };

    this.statusLocators = {
      cartEmptyMessage: page.locator('div.cart-empty'),
    };
  }

  actionTo = {
    changeProductQuantityTo: async (productName: string, quantity: number) => {
      const productRow    = this.productLocators.cartItemRows.filter({ hasText: productName });
      const quantityInput = productRow.locator(this.productLocators.quantityInput);
      await quantityInput.fill(quantity.toString());
    },

    updateCart: async () => {
      await this.page.waitForLoadState('networkidle');
      await this.cartLocators.updateCartButton.click();
      await this.page.waitForLoadState('networkidle');
    },

    emptyCart: async () => {
      await this.page.waitForLoadState('networkidle');

      while ((await this.productLocators.removeButtons.count()) > 0) {
        const firstRemoveButton = this.productLocators.removeButtons.first();
        await firstRemoveButton.waitFor({ state: 'visible' });
        const removeUrl = await firstRemoveButton.getAttribute('href');

        if (!removeUrl) throw new Error('Remove button has no href – check locator or page state');

        await this.page.goto(removeUrl);
        await this.page.waitForLoadState('networkidle');
      }
    },
  };

  checkThat = {
    totalPriceIs: async (expectedTotalPrice: string) => {
      await expect(this.priceLocators.totalPrice).toHaveText(expectedTotalPrice);
    },

    cartIsEmptyMessageIsVisible: async () => {
      await expect(this.statusLocators.cartEmptyMessage).toBeVisible();
      await expect(this.statusLocators.cartEmptyMessage).toHaveText('Your cart is currently empty.');
    },

    compareTotalPriceWithCalculatedTotalPriceOfSubtotals: async () => {
      let subtotalSum = 0;
      const subtotalCount = await this.priceLocators.subtotalPrices.count();

      for (let index = 0; index < subtotalCount; index++) {
        const subtotalText = await this.priceLocators.subtotalPrices.nth(index).textContent();
        if (subtotalText) subtotalSum += parsePrice(subtotalText);
      }

      const totalPriceText = (await this.priceLocators.totalPrice.textContent()) ?? '0';
      const totalPrice     = parsePrice(totalPriceText);

      expect(subtotalSum).toBeCloseTo(totalPrice, 2);
    },
  };
}