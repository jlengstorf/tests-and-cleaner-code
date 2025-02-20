export class MenuItem {
	name = '';

	constructor(name: string) {
		this.name = name;
	}
}

interface MenuClient {
	getItems: () => Promise<Array<MenuItem>>;
}

export interface EatenItemsStore {
	getEatenItems: () => Set<string>;
	markItemAsEaten: (name: string) => Promise<boolean>;
}

export class EatenItemsFake implements EatenItemsStore {
	items = new Set<string>();

	getEatenItems(): Set<string> {
		return this.items;
	}

	async markItemAsEaten(name: string): Promise<boolean> {
		this.items.add(name);
		return true;
	}
}

export class EatenItemsLocalStorage implements EatenItemsStore {
	getEatenItems() {
		const stored = localStorage.getItem('cheesecake-factory:eaten-items');

		if (!stored) {
			return new Set<string>();
		}

		return new Set<string>(JSON.parse(stored));
	}

	async markItemAsEaten(name: string) {
		const items = this.getEatenItems();

		items.add(name);

		localStorage.setItem(
			'cheesecake-factory:eaten-items',
			JSON.stringify([...items]),
		);

		return true;
	}
}

export class CheeseCakeFactoryMenuClient implements MenuClient {
	async getItems(): Promise<Array<MenuItem>> {
		const res = await fetch(
			'https://www.thecheesecakefactory.com/api/olo/restaurants/171338/menu?nomnom=add-restaurant-to-menu&includedisabled=true',
		);
		if (!res.ok) {
			throw new Error('Cheesecake denied');
		}

		const menu: { categories: Array<{ products: Array<{ name: string }> }> } =
			await res.json();

		let results: Array<MenuItem> = [];

		for (let cat of menu.categories) {
			for (let product of cat.products) {
				results.push(new MenuItem(product.name));
			}
		}

		return results;
	}
}

export class MenuClientStub implements MenuClient {
	async getItems() {
		return [
			new MenuItem('cheesecake'),
			new MenuItem('also cheesecake'),
			new MenuItem('more cheesecake'),
			new MenuItem('cheesy cheesecake'),
			new MenuItem('pumpkin cheesecake'),
			new MenuItem('salted caramel cheesecake'),
		];
	}
}

export class MenuService {
	client: MenuClient;
	eaten: EatenItemsStore;

	constructor(client: MenuClient, eaten: EatenItemsStore) {
		this.client = client;
		this.eaten = eaten;
	}

	async getItems() {
		// const res = await
		// https://www.thecheesecakefactory.com/api/olo/restaurants/171338/menu?nomnom=add-restaurant-to-menu&includedisabled=true
		return await this.client.getItems();
	}

	getEatenItems() {
		return this.eaten.getEatenItems();
	}

	markItemAsEaten(name: string) {
		this.eaten.markItemAsEaten(name);
	}
}

const eatenItems = new EatenItemsFake();

export function getMenuService() {
	const client = new CheeseCakeFactoryMenuClient();

	return new MenuService(client, eatenItems);
}
