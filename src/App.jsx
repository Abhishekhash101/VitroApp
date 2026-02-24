import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import DashboardLayout from './components/DashboardLayout';
import SignUpPage from './components/SignUpPage';
import AccountSettingsPage from './components/AccountSettingsPage';
import MainWorkspace from './components/MainWorkspace';
import LoginPage from './components/LoginPage';

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
          <Route path="/dashboard" element={<DashboardLayout />} />
          {/* MainWorkspace acts as our project view */}
          <Route path="/workspace/:projectId" element={<MainWorkspace />} />
          <Route path="/settings" element={<AccountSettingsPage />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
