import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Iconify } from '@/web/components/icon';
import { CircleLoading } from '@/web/components/loading';

import { AppRouteObject } from '@/types/router';

const MarkdownPage = lazy(() => import('@/web/pages/components/markdown'));
const UploadPage = lazy(() => import('@/web/pages/components/upload'));
const ChartPage = lazy(() => import('@/web/pages/components/chart'));

const components: AppRouteObject = {
  order: 3,
  path: 'components',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.components',
    icon: <Iconify icon="solar:widget-5-bold-duotone" className="ant-menu-item-icon" size="24" />,
    key: '/components',
  },
  children: [
    {
      index: true,
      element: <Navigate to="icon" replace />,
    },
    {
      path: 'markdown',
      element: <MarkdownPage />,
      meta: { label: 'sys.menu.markdown', key: '/components/markdown' },
    },
    {
      path: 'upload',
      element: <UploadPage />,
      meta: { label: 'sys.menu.upload', key: '/components/upload' },
    },
    {
      path: 'chart',
      element: <ChartPage />,
      meta: { label: 'sys.menu.chart', key: '/components/chart' },
    },
  ],
};

export default components;
