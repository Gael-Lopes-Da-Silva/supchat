import * as reactdom from 'react-router-dom';
import * as reacttoastify from 'react-toastify';

import DashboardPage from './pages/DashboardPage/DashboardPage';
import IndexPage from './pages/IndexPage/IndexPage';
import LoginPage from './pages/LoginPage/LoginPage';
import PrivaryPage from './pages/PrivacyPage/PrivacyPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import AccountConfirmedPage from './pages/RegisterPage/AccountConfirmedPage';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import TermsPage from './pages/TermsPage/TermsPage';

import PrivateRoutes from './components/PrivateRoutes/PrivateRoutes';

const App = () => {
    return (
        <reactdom.BrowserRouter>
            <reacttoastify.ToastContainer theme="colored" />
            <reactdom.Routes>

                <reactdom.Route path="/login" element={<LoginPage />} />
                <reactdom.Route path="/register" element={<RegisterPage />} />
                <reactdom.Route path="/accountConfirmed" element={<AccountConfirmedPage />} />
                <reactdom.Route path="/terms" element={<TermsPage />} />
                <reactdom.Route path="/privacy" element={<PrivaryPage />} />
                <reactdom.Route path="/reset_password" element={<ResetPasswordPage />} />


                <reactdom.Route element={<PrivateRoutes />}>
                    <reactdom.Route path="/" element={<IndexPage />} />
                    <reactdom.Route path="/dashboard" element={<DashboardPage />} />
                    <reactdom.Route path="/settings" element={<SettingsPage />} />
                </reactdom.Route>

            </reactdom.Routes>
        </reactdom.BrowserRouter>
    );
};

export default App;
