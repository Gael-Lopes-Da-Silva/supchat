import react from 'react';

import "./DashboardPage.css"

const DashboardPage = () => {
    react.useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            window.location.href = '/';
        }
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-left">
            </div>
            <div className="dashboard-right">
            </div>
        </div>
    );
};

export default DashboardPage;
