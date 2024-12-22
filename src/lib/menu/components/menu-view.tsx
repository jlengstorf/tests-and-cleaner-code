import { useState, useEffect } from 'react';
import { type MenuItem, getMenuService } from '../menu-service';

const useMenuItems = () => {
	const [items, setItems] = useState<Array<MenuItem>>([]);

	useEffect(() => {
		const service = getMenuService();

		async function load() {
			const resItems = await service.getItems();

			setItems(resItems);
		}

		load();
	}, []);

	return items;
};

export const MenuView = () => {
	const items = useMenuItems();

	return items.map(({ name }) => <div key={`item-${name}`}>{name}</div>);
};
