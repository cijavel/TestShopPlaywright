import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage.pom';
import { ShoppingCartPage } from '../pages/ShoppingCartPage.pom';
import { ProductDetailPage } from '../pages/ProductDetailPage.pom';

type MyFixtures = {
  homepage: HomePage;
  shoppingCart: ShoppingCartPage;
  productDetailPage: ProductDetailPage;
};

export const test = base.extend<MyFixtures>({
  homepage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  shoppingCart: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
});

export { expect } from '@playwright/test';