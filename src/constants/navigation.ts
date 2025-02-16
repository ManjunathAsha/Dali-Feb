import {ROUTES} from './routes';
import {ROLES} from './roles';
import {ARIA_LABELS} from './aria';

export const NAVIGATION_ITEMS = {
    MAIN: [
      {
        id: 'handbook',
        title: 'Handbook',
        path: ROUTES.HANDBOOK.ROOT,
        icon: 'MenuBook',
        requiredRoles: [ROLES.OWNER, ROLES.READER, ROLES.PUBLISHER],
        ariaLabel: ARIA_LABELS.SECTIONS.HANDBOOK,
      },
      {
        id: 'settings',
        title: 'Settings',
        path: ROUTES.SETTINGS,
        icon: 'Settings',
        requiredRoles: [ROLES.ADMIN, ROLES.SYSTEM_ADMIN],
        ariaLabel: 'Access settings',
      },
    ],
    HANDBOOK: {
      FILTERS: [
        {
          id: 'chapter',
          title: 'Chapter',
          type: 'dropdown',
          ariaLabel: 'Filter by chapter',
        },
        {
          id: 'level',
          title: 'Level',
          type: 'dropdown',
          ariaLabel: 'Filter by level',
        },
        // ... other filters
      ],
    }
  };