import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OauthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get('token');

        if (token) {
            localStorage.setItem('access_token', token);
            // Optionally: gọi API /auth/refresh-token để lấy refresh_token nếu cần
            navigate('/');
        } else {
            navigate('/login');
        }
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <h3>Đang đăng nhập...</h3>
        </div>
    );
};

export default OauthSuccess;
