import React, { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';
import SignUpPage from './components/SignUpPage';
import AccountSettingsPage from './components/AccountSettingsPage';
import MainWorkspace from './components/MainWorkspace';
import LoginPage from './components/LoginPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Simple routing for demonstration purposes
  if (currentPath === '/login') {
    return <LoginPage />;
  }

  if (currentPath === '/signup') {
    return <SignUpPage />;
  }

  if (currentPath === '/settings') {
    return <AccountSettingsPage />;
  }

  if (currentPath === '/workspace') {
    return <MainWorkspace />;
  }

  // To easily preview the sign-up page for the user's request without writing a router:
  // Render Dashboard on root, give a toggle or just uncomment
  return (
    <DashboardLayout />
  );
}

export default App;
