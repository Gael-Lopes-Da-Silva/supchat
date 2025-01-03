import { useEffect } from 'react';

import './LogoutPage.css';

const LogoutPage = () => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            localStorage.removeItem('token');
        }
        
        window.location.href = "/login";
    }, []);

    return null;
};

export default LogoutPage;