import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider } from './context/CommonContext';
import Project from './pages/Project';
import Products from './adminPages/Procurement/Products';
import Test from './Test';
import In from './adminPages/Inventory/In';
import Out from './adminPages/Inventory/Out';
import PrjCollab from './pages/PrjCollab';
import StockAdjustment from './adminPages/Inventory/StockAdjustment';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-panel" element={<ProtectedRoute element={<AdminPanel />} />} />
        <Route path="/project/:id" element={<ProtectedRoute element={<Project />} />} />
        <Route path="/project-collab/:id" element={<ProtectedRoute element={<PrjCollab />} />} />
        <Route path="/products/:id" element={<ProtectedRoute element={<Products />} />} />
        <Route path="/inventory_in" element={<ProtectedRoute element={<In />} />} />
        <Route path="/inventory_out" element={<ProtectedRoute element={<Out />} />} />
        <Route path="/stock-adjustment" element={<ProtectedRoute element={<StockAdjustment />} />} />

        <Route path="/test" element={<ProtectedRoute element={<Test />} />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
