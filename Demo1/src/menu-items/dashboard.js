// assets
import { IconDashboard } from '@tabler/icons-react';
import React from 'react';
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
    {
      id: 'default',
      title: 'Chart Js',
      type: 'item',
      url: '/dashboard/chart',
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/horizontal-chart',
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
  ]
};


export default dashboard;
