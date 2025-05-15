import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import ListDistribution from './pages/ListDistribution';
import Batches from './pages/Batches';
import BatchDetails from './pages/BatchDetails';
import AgentDetails from './pages/AgentDetails';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-slow">
          <svg
            className="w-16 h-16 text-primary-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Combined login/register page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Redirect old login/register paths to /auth */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />

        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="agents" element={<Agents />} />
          <Route path="agents/:id" element={<AgentDetails />} />
          <Route path="list-distribution" element={<ListDistribution />} />
          <Route path="batches" element={<Batches />} />
          <Route path="batches/:id" element={<BatchDetails />} />
        </Route>

        {/* Catch-all: redirect unknown routes to /auth */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </>
  );
}

export default App;