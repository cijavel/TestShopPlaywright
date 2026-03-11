import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;

  readonly productInfoLocators: {
    productTitle:      Locator;
    productPrice:      Locator;
  };

  readonly descriptionLocators: {
    shortDescription:  Locator;
    longDescription:   Locator;
  };

  readonly galleryLocators: {
    productImage:      Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.productInfoLocators = {
      productTitle: page.locator('h1.product_title.entry-title'),
      productPrice: page.locator('.entry-summary p.price .woocommerce-Price-amount'),
    };

    this.descriptionLocators = {
      shortDescription: page.locator('.woocommerce-product-details__short-description'),
      longDescription:  page.locator('#tab-description'),
    };

    this.galleryLocators = {
      productImage: page.locator('.woocommerce-product-gallery__wrapper img.wp-post-image'),
    };
  }

  actionTo = {};

  checkThat = {

    isOnProductDetailPage: async () => {
      await expect(this.page).toHaveURL(/\/produkt\//);
    },

    productTitleIs: async (expectedTitle: string) => {
      await expect(this.productInfoLocators.productTitle).toBeVisible();
      await expect(this.productInfoLocators.productTitle).toHaveText(expectedTitle);
    },

    productPriceIs: async (expectedPrice: string) => {
      await expect(this.productInfoLocators.productPrice).toBeVisible();
      await expect(this.productInfoLocators.productPrice).toContainText(expectedPrice);
    },

    shortDescriptionIsVisible: async () => {
      await expect(this.descriptionLocators.shortDescription).toBeVisible();
      await expect(this.descriptionLocators.shortDescription).not.toBeEmpty();
    },

    longDescriptionIsVisible: async () => {
      await expect(this.descriptionLocators.longDescription).toBeVisible();
      await expect(this.descriptionLocators.longDescription).not.toBeEmpty();
    },

    productImageIsVisible: async () => {
      await expect(this.galleryLocators.productImage).toBeVisible();
      await expect(this.galleryLocators.productImage).toHaveAttribute('alt', /.+/);
    },

  };
}