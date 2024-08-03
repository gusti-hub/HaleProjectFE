import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider } from './context/CommonContext';
import Project from './pages/Project';
import Products from './adminPages/Procurement/Products';
import Test from './Test';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-panel" element={<ProtectedRoute element={<AdminPanel />} />} />
        <Route path="/project/:id" element={<ProtectedRoute element={<Project />} />} />
        <Route path="/products/:id" element={<ProtectedRoute element={<Products />} />} />
        <Route path="/test" element={<ProtectedRoute element={<Test />} />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
