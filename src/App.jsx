import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import DashboardLayout from './components/DashboardLayout';
import SignUpPage from './components/SignUpPage';
import AccountSettingsPage from './components/AccountSettingsPage';
import MainWorkspace from './components/MainWorkspace';
import LoginPage from './components/LoginPage';

function App() {
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
