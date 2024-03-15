import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';

export default () => {
  return (<Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Layout />} /> {/* 使用 "/*" 来匹配 ProLayout 中的所有子路由 */}
    </Routes>
  </Router>)
};
