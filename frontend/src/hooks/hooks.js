// import { useState, useEffect, useCallback } from 'react';
// import api from '../api/api';

// // Generic data fetching hook
// export const useFetch = (url, deps = []) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetch = useCallback(async () => {
//     if (!url) return;
//     setLoading(true);
//     try {
//       const res = await api.get(url);
//       setData(res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   }, [url, ...deps]);

//   useEffect(() => { fetch(); }, [fetch]);

//   return { data, loading, error, refetch: fetch };
// };

// // Debounce hook for search inputs
// export const useDebounce = (value, delay = 400) => {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const t = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(t);
//   }, [value, delay]);
//   return debounced;
// };

import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';

export const useFetch = (url, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const run = useCallback(async () => {
    if (!url) { setLoading(false); return; }
    setLoading(true);
    try { const r = await api.get(url); setData(r.data); setError(null); }
    catch (e) { setError(e.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);
  useEffect(() => { run(); }, [run]);
  return { data, loading, error, refetch: run };
};

export const useDebounce = (value, delay = 400) => {
  const [d, setD] = useState(value);
  useEffect(() => { const t = setTimeout(() => setD(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return d;
};
