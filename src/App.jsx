import  { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
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
import ProfilePage from './pages/ProfilePage';
import AutoLogout from './utils/AutoLogout';
import TE from './adminPages/Time&Expenses/TE';
import ViewDoc from './adminPages/Time&Expenses/ViewDoc';

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const currentPath = window.location.pathname;

    if (token && currentPath === '/') {
      navigate('/admin-panel');
    }
    else if (!token && currentPath !== '/') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <AppProvider>
      <AutoLogout />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-panel" element={<ProtectedRoute element={<AdminPanel />} />} />
        <Route path="/project/:id" element={<ProtectedRoute element={<Project />} />} />
        <Route path="/project-collab/:id" element={<ProtectedRoute element={<PrjCollab />} />} />
        <Route path="/products/:id" element={<ProtectedRoute element={<Products />} />} />
        <Route path="/inventory_in" element={<ProtectedRoute element={<In />} />} />
        <Route path="/inventory_out" element={<ProtectedRoute element={<Out />} />} />
        <Route path="/stock-adjustment" element={<ProtectedRoute element={<StockAdjustment />} />} />
        <Route path="/profile/:id" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="/time-expenses" element={<ProtectedRoute element={<TE />} />} />
        <Route path="/view-doc/:type/:id" element={<ProtectedRoute element={<ViewDoc />} />} />

        <Route path="/test" element={<ProtectedRoute element={<Test />} />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
