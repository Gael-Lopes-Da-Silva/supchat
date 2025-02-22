import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './IndexPage.css';

const IndexPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(localStorage.getItem("user") ? "/dashboard" : "/login");
    }, [navigate]);

    return null;
};

export default IndexPage;