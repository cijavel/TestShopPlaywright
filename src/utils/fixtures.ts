import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage.pom';
import { ShoppingCartPage } from '../pages/ShoppingCartPage.pom';

type MyFixtures = {
  homepage: HomePage;
  shoppingCart: ShoppingCartPage;
};

export const test = base.extend<MyFixtures>({
  homepage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  shoppingCart: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },
});

export { expect } from '@playwright/test';