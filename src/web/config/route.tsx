import React from 'react';
import UserAnalysis from '@/web/pages/Analysis/UserAnalysis';
import DataAnalysis from '@/web/pages/Analysis/DataAnalysis';
import BehaviorAnalysis from '@/web/pages/Analysis/BehaviorAnalysis';

import {
    DashboardOutlined,
    PieChartOutlined,
    LineChartOutlined,
    UsergroupAddOutlined

} from '@ant-design/icons';

const routeConfig = {
    routes: [{
        path: '/',
        name: '数据分析',
        icon: <DashboardOutlined />,
        routes: [
            {
                path: '/data-analysis',
                name: '数据概览',
                icon: <PieChartOutlined />,
                component: <DataAnalysis />,
            },
            {
                path: '/behavior-analysis',
                name: '行为分析',
                icon: <LineChartOutlined />,
                component: <BehaviorAnalysis />,
            },
            {
                path: '/user-analysis',
                name: '用户分析',
                icon: <UsergroupAddOutlined />,
                component: <UserAnalysis />,
            }
        ]
    },
        // {
        //     path: '/about',
        //     name: '关于',
        //     icon: 'info-circle',
        //     component: <Welcome />,
        // }
    ]
};

export default routeConfig