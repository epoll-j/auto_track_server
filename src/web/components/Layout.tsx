import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ProLayout from '@ant-design/pro-layout';
import routeConfig from '../config/route';

const Layout = () => {
    const navigate = useNavigate();
    const handleMenuClick = (event) => {
        navigate(event.key);
    };

    const generateRoutes = (routes) => {
        return routes.map((route) => {
            if (route.routes) {
                return (
                    <Route key={route.path} path={route.path} element={route.component}>
                        {generateRoutes(route.routes)}
                    </Route>
                );
            } else {
                return <Route key={route.path} path={route.path} element={route.component} />;
            }
        });
    };

    return (<ProLayout
        menuItemRender={(item, dom) => (
            <a onClick={() => handleMenuClick(item)}>{dom}</a>
        )}
        layout='mix'
        route={routeConfig}
    >
        <Routes>
            {generateRoutes(routeConfig.routes)}
        </Routes>
    </ProLayout>)
}


export default Layout;