import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import EntriesPage from './pages/EntriesPage';
import AddEntryPage from './pages/AddEntryPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { getToken } from './services/authService';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    setAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onAuth={() => setAuthenticated(true)} />} />
        <Route path="/" element={<ProtectedRoute authenticated={authenticated}><EntriesPage /></ProtectedRoute>} />
        <Route path="/entries" element={<ProtectedRoute authenticated={authenticated}><EntriesPage /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute authenticated={authenticated}><AddEntryPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute authenticated={authenticated}><SettingsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute authenticated={authenticated}><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={authenticated ? '/' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
