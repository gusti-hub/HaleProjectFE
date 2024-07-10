import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider } from './context/CommonContext';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin-panel" element={<ProtectedRoute element={<AdminPanel />} />} />
        </Routes>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
