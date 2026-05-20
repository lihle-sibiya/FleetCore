import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Dealerships from './pages/Dealerships';
import PrivateCustomers from './pages/PrivateCustomers';
import Vehicles from './pages/Vehicles';
import Applications from './pages/Applications';
import Invoices from './pages/Invoices';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/dealerships" element={<Protected><Dealerships /></Protected>} />
          <Route path="/customers" element={<Protected><PrivateCustomers /></Protected>} />
          <Route path="/vehicles" element={<Protected><Vehicles /></Protected>} />
          <Route path="/applications" element={<Protected><Applications /></Protected>} />
          <Route path="/invoices" element={<Protected><Invoices /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
