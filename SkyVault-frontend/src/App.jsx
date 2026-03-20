import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Login       from './pages/Login';
import Register    from './pages/Register';
import Dashboard   from './pages/Dashboard';
import Shared      from './pages/Shared';
import Starred     from './pages/Starred';
import Recent      from './pages/Recent';
import Trash       from './pages/Trash';
import PublicShare from './pages/PublicShare';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Spinner = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="w-9 h-9 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"            element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register"         element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/share/:token"     element={<PublicShare />} />

      <Route path="/"                 element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/folder/:folderId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/shared"           element={<ProtectedRoute><Shared /></ProtectedRoute>} />
      <Route path="/starred"          element={<ProtectedRoute><Starred /></ProtectedRoute>} />
      <Route path="/recent"           element={<ProtectedRoute><Recent /></ProtectedRoute>} />
      <Route path="/trash"            element={<ProtectedRoute><Trash /></ProtectedRoute>} />

      <Route path="*"                 element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}


export default App;