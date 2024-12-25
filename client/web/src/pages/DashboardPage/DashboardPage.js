import React, { useEffect, useState } from 'react';

const DashboardPage = () => {
    const [workspaces, setWorkspaces] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            window.location.href = '/';
        }
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                {/* On va mapper les workspaces ici*/}  { }
            </div>
        </div>
    );
};

export default DashboardPage;
