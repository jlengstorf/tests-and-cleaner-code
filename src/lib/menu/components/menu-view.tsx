import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { type MenuItem, getMenuService } from '../menu-service';

const useMenuItems = () => {
	const [items, setItems] = useState<Array<MenuItem>>([]);
	const [eatenItems, setEatenItems] = useState<Set<string>>(new Set());

	const service = useMemo(getMenuService, []);

	useEffect(() => {
		async function load() {
			const resItems = await service.getItems();
			const eatenItems = await service.getEatenItems();

			setItems(resItems);
			setEatenItems(eatenItems);
		}

		load();
	}, []);

	async function markAsEaten(name: string) {
		await service.markItemAsEaten(name);
		const eatenItems = await service.getEatenItems();

		setEatenItems(new Set(eatenItems));
	}

	return { items, eatenItems, markAsEaten };
};

export const MenuView = () => {
	const { items, eatenItems, markAsEaten } = useMenuItems();

	function handleClick(event) {
		const newItem = event.target.value;

		markAsEaten(newItem);
	}

	return items.map(({ name }) => (
		<label
			key={`item-${name}`}
			onClick={handleClick}
			style={{ display: 'block' }}
		>
			<input type="checkbox" value={name} checked={eatenItems.has(name)} />
			{name}
		</label>
	));
};
