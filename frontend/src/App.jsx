// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import Layout from "./components/layout/Layout";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Companies from "./pages/Dealerships";
// import Vehicles from "./pages/Vehicles";
// import Invoices from "./pages/Invoices";

// const Protected = ({ children }) => {
//   const { user, loading } = useAuth();
//   if (loading) return null;
//   return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
// };

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route
//             path="/"
//             element={
//               <Protected>
//                 <Dashboard />
//               </Protected>
//             }
//           />
//           <Route
//             path="/companies"
//             element={
//               <Protected>
//                 <Companies />
//               </Protected>
//             }
//           />
//           <Route
//             path="/vehicles"
//             element={
//               <Protected>
//                 <Vehicles />
//               </Protected>
//             }
//           />
//           <Route
//             path="/invoices"
//             element={
//               <Protected>
//                 <Invoices />
//               </Protected>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Invoices from './pages/Invoices';
import Vehicles from './pages/Vehicles';
import Customers from './pages/PrivateCustomers';
import Dealerships from './pages/Dealerships';

const Guard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"        element={<Login />} />
          <Route path="/"             element={<Guard><Dashboard /></Guard>} />
          <Route path="/applications" element={<Guard><Applications /></Guard>} />
          <Route path="/invoices"     element={<Guard><Invoices /></Guard>} />
          <Route path="/vehicles"     element={<Guard><Vehicles /></Guard>} />
          <Route path="/customers"    element={<Guard><Customers /></Guard>} />
          <Route path="/dealerships"  element={<Guard><Dealerships /></Guard>} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
