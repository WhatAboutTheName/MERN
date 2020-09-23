import { useState, useCallback, useEffect } from 'react';
import { createBrowserHistory } from 'history';

const storName = 'userData';

export const Auth = () => {

    const history = createBrowserHistory();
    const [token, setToken] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [isLogin, setIsLogin] = useState(null);
    const [userId, setUserId] = useState(null);
    const [time, setTime] = useState(null);

    const login = useCallback((admin, jwtToken, expiresIn, id, isLogin) => {
        setAdmin(admin);
        setToken(jwtToken);
        setUserId(id);
        setIsLogin(isLogin);
        setTime(expiresIn);
        localStorage.setItem(storName, JSON.stringify({
            userId: id,
            token: jwtToken,
            time: expiresIn
        }));
        authTime(expiresIn);
        history.push('/');
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setIsLogin(null);
        setAdmin(null);
        setTime(null);
        localStorage.removeItem(storName);
        history.push('/user/log-in');
        window.location.reload();
    }, []);

    const authTime = expiresIn => {
        setTimeout(() => {
            logout();
        }, time || expiresIn * 1000);
    }
    
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storName));
        if (data && data.userId) {
            login(data.token, data.userId);
        }
    }, [login]);

    return { login, logout, admin, token, userId, isLogin };
}