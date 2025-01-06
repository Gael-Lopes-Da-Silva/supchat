import react from 'react';

import './IndexPage.css';

const IndexPage = () => {
    react.useEffect(() => {
        const token = localStorage.getItem('token');
        window.location.href = token ? "/dashboard" : "/login";
    }, []);

    return null;
};

export default IndexPage;