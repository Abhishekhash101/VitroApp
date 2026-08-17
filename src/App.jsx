import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider, useAppContext } from './context/AppContext';
import DashboardLayout from './components/DashboardLayout';
import SignUpPage from './components/SignUpPage';
import AccountSettingsPage from './components/AccountSettingsPage';
import MainWorkspace from './components/MainWorkspace';
import LoginPage from './components/LoginPage';

// Guard that redirects to /login when there is no logged-in user.
function ProtectedRoute({ children }) {
  const { user } = useAppContext();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {

  // Prevent browser from opening dragged files if they miss the editor dropzone
  useEffect(() => {
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => e.preventDefault();

    window.addEventListener('dragover', handleDragOver, false);
    window.addEventListener('drop', handleDrop, false);

    return () => {
      window.removeEventListener('dragover', handleDragOver, false);
      window.removeEventListener('drop', handleDrop, false);
    };
  }, []);

  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
          {/* MainWorkspace acts as our project view */}
          <Route path="/workspace/:projectId" element={<ProtectedRoute><MainWorkspace /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
