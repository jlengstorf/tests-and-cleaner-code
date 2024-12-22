import { describe, it, expect } from 'vitest';
import {
	EatenItemsFake,
	MenuClientStub,
	MenuService,
	type EatenItemsStore,
} from './menu-service';

describe('menu-service', () => {
	it('loads all menu items', async () => {
		const client = new MenuClientStub();
		const menuService = new MenuService(client, {} as EatenItemsStore);

		expect(await menuService.getItems()).toHaveLength(6);
	});

	it('marks an item as "eaten"', async () => {
		const client = new MenuClientStub();
		const eaten = new EatenItemsFake();
		const menuService = new MenuService(client, eaten);

		await menuService.markItemAsEaten('cheesecake');

		expect(menuService.getEatenItems()).toContain('cheesecake');
	});
});
