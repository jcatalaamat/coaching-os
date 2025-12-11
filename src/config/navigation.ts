import React from 'react';

export interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Navigation configuration for sidebar
// Icons will be added when we adapt the sidebar component
export const navigationConfig: NavSection[] = [
  {
    title: 'Main',
    items: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: null, // Will be replaced with GridIcon
      },
      {
        name: 'Clients',
        path: '/clients',
        icon: null, // Will be replaced with UserCircleIcon
      },
      {
        name: 'Sessions',
        path: '/sessions',
        icon: null, // Will be replaced with CalenderIcon
      },
      {
        name: 'Programs',
        path: '/programs',
        icon: null, // Will be replaced with BoxCubeIcon
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        name: 'Billing',
        path: '/billing',
        icon: null, // Will be replaced with DollarLineIcon
      },
      {
        name: 'Settings',
        path: '/settings',
        icon: null, // Will be replaced with ListIcon
      },
    ],
  },
];
