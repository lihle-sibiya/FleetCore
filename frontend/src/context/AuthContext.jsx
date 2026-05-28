// import { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const stored = localStorage.getItem('fleetcore_user');
//     if (stored) setUser(JSON.parse(stored));
//     setLoading(false);
//   }, []);

//   const login = (data) => {
//     setUser(data);
//     localStorage.setItem('fleetcore_user', JSON.stringify(data));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('fleetcore_user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useState } from "react";
// const Ctx = createContext(null);
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     try {
//       const s = localStorage.getItem("fc_user");
//       return s ? JSON.parse(s) : null;
//     } catch {
//       return null;
//     }
//   });
//   const login = (d) => {
//     localStorage.setItem("fc_user", JSON.stringify(d));
//     setUser(d);
//   };
//   const logout = () => {
//     localStorage.removeItem("fc_user");
//     setUser(null);
//   };
//   return (
//     <Ctx.Provider value={{ user, login, logout, loading: false }}>
//       {children}
//     </Ctx.Provider>
//   );
// };
// export const useAuth = () => useContext(Ctx);

import { createContext, useContext, useState } from 'react';
const Ctx = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem('fc_user'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const login  = d => { localStorage.setItem('fc_user', JSON.stringify(d)); setUser(d); };
  const logout = () => { localStorage.removeItem('fc_user'); setUser(null); };
  return <Ctx.Provider value={{ user, login, logout, loading: false }}>{children}</Ctx.Provider>;
};
export const useAuth = () => useContext(Ctx);