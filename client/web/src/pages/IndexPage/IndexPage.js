import { useEffect } from 'react';

import './IndexPage.css';

const IndexPage = () => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        window.location.href = token ? "/dashboard" : "/login";
    }, []);

    return null;
};

export default IndexPage;