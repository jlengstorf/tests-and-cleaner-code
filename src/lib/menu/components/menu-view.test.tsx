import { describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MenuView } from './menu-view';
import * as MenuServiceModule from '../menu-service';

describe('MenuView', () => {
	it('lists menu items', async () => {
		vi.spyOn(MenuServiceModule, 'getMenuService').mockReturnValue(
			new MenuServiceModule.MenuService(new MenuServiceModule.MenuClientStub()),
		);

		render(<MenuView />);

		await screen.findByText('cheesecake');
	});
});
