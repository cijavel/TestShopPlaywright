import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';

/**
 * Attach commonly used page objects to the standard Playwright test fixture.
 * Any spec that imports `test` from this file will have the objects available.
 */
type Fixtures = {
  homepage: HomePage;
  shoppingCart: ShoppingCartPage;
};

export const test = base.extend<Fixtures>({
  homepage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  shoppingCart: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },
});

export { expect };
