import { NavItem } from './nav-item/nav-item';
import { RouterLink } from '@angular/router';
export const navItems: NavItem[] = [
  {
    displayName: 'Game Tycoon',
    iconName: 'solar:gamepad-line-duotone', // Add an icon for Game Tycoon
    children: [
      {
        displayName: 'Add Game',
        iconName: 'solar:add-circle-line-duotone',
        route: '/game/add',
      },
      {
        displayName: 'All Games',
        iconName: 'solar:list-check-line-duotone',
        route: '/game/all',
      },
      {
        displayName: 'My Games',
        iconName: 'solar:user-circle-line-duotone',
        route: '/game/my',
      },
    ],
  }
];
