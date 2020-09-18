import { useState, useCallback, useEffect } from 'react';

const storName = 'userData';

export const Auth = () => {

    const [token, setToken] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [isLogin, setIsLogin] = useState(null);
    const [userId, setUserId] = useState(null);

    const login = useCallback((admin, jwtToken, id, isLogin) => {
        setAdmin(admin);
        setToken(jwtToken);
        setUserId(id);
        setIsLogin(isLogin);
        localStorage.setItem(storName, JSON.stringify({
            userId: id,
            token: jwtToken
        }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setIsLogin(null);
        setAdmin(null);
        localStorage.removeItem(storName);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storName));
        if (data && data.userId) {
            login(data.token, data.userId);
        }
    }, [login]);

    return { login, logout, admin, token, userId, isLogin};
}