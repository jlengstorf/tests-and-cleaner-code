import { describe, it, vi, expect, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MenuView } from './menu-view';
import * as MenuServiceModule from '../menu-service';

describe('MenuView', () => {
	it('lists menu items', async () => {
		vi.spyOn(MenuServiceModule, 'getMenuService').mockReturnValue(
			new MenuServiceModule.MenuService(
				new MenuServiceModule.MenuClientStub(),
				new MenuServiceModule.EatenItemsFake(), // <-- not actually used (dummy)
			),
		);

		render(<MenuView />);

		await screen.findByText('cheesecake');
	});

	it('marks an item as eaten', async () => {
		vi.spyOn(MenuServiceModule, 'getMenuService').mockReturnValue(
			new MenuServiceModule.MenuService(
				new MenuServiceModule.MenuClientStub(),
				new MenuServiceModule.EatenItemsFake(), // <-- not actually used (dummy)
			),
		);

		render(<MenuView />);

		// find the item with the name we're looking for
		const item = (await screen.findByLabelText(
			'cheesecake',
		)) as HTMLInputElement;

		expect(item.checked).toBeFalsy();

		// click that checkbox
		item.click();

		// assert that the box is checked
		await waitFor(() => expect(item.checked).toBeTruthy());
	});

	it('renders eaten items', async () => {
		const eatenItems = new MenuServiceModule.EatenItemsFake();
		eatenItems.markItemAsEaten('cheesecake');

		vi.spyOn(MenuServiceModule, 'getMenuService').mockReturnValue(
			new MenuServiceModule.MenuService(
				new MenuServiceModule.MenuClientStub(),
				eatenItems, // <-- not actually used (dummy)
			),
		);

		render(<MenuView />);

		// find the item with the name we're looking for
		const item = (await screen.findByLabelText(
			'cheesecake',
		)) as HTMLInputElement;

		expect(item.checked).toBeTruthy();
	});

	afterEach(() => {
		cleanup();
	});
});
