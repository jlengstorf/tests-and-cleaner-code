import { test, expect } from '@playwright/test';

test('view and mark item as eaten', async ({ page }) => {
	await page.goto('/');

	let item = page.getByLabel('Mexicali Salad');

	await expect(item).not.toBeChecked();

	await item.click();

	await expect(item).toBeChecked();

	await page.reload();

	item = page.getByLabel('Mexicali Salad');

	await expect(item).toBeChecked();
});
