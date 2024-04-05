import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Iconify } from '@/web/components/icon';
import { CircleLoading } from '@/web/components/loading';

import { AppRouteObject } from '@/types/router';

const AnimatePage = lazy(() => import('@/web/pages/components/animate'));
const ScrollPage = lazy(() => import('@/web/pages/components/scroll'));
const MarkdownPage = lazy(() => import('@/web/pages/components/markdown'));
const EditorPage = lazy(() => import('@/web/pages/components/editor'));
const MultiLanguagePage = lazy(() => import('@/web/pages/components/multi-language'));
const IconPage = lazy(() => import('@/web/pages/components/icon'));
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
      path: 'icon',
      element: <IconPage />,
      meta: { label: 'sys.menu.icon', key: '/components/icon' },
    },
    {
      path: 'animate',
      element: <AnimatePage />,
      meta: { label: 'sys.menu.animate', key: '/components/animate' },
    },
    {
      path: 'scroll',
      element: <ScrollPage />,
      meta: { label: 'sys.menu.scroll', key: '/components/scroll' },
    },
    {
      path: 'markdown',
      element: <MarkdownPage />,
      meta: { label: 'sys.menu.markdown', key: '/components/markdown' },
    },
    {
      path: 'editor',
      element: <EditorPage />,
      meta: { label: 'sys.menu.editor', key: '/components/editor' },
    },
    {
      path: 'i18n',
      element: <MultiLanguagePage />,
      meta: { label: 'sys.menu.i18n', key: '/components/i18n' },
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
