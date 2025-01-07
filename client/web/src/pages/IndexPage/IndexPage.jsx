import * as react from 'react';
import * as reactdom from 'react-router-dom';

import './IndexPage.css';

const IndexPage = () => {
    const navigate = reactdom.useNavigate();
    
    react.useEffect(() => {
        navigate(localStorage.getItem('token') ? "/dashboard" : "/login");
    }, []);

    return null;
};

export default IndexPage;