import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import IndexPage from './pages/IndexPage/IndexPage'
import LoginPage from './pages/LoginPage/LoginPage';
import TermsPage from './pages/TermsPage/TermsPage';
import PrivaryPage from './pages/PrivacyPage/PrivacyPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivaryPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </Router>
    );
};

export default App;
