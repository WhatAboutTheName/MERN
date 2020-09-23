import React, { useState, useContext, useEffect } from 'react';
import { Http } from '../../../hooks/http.hook';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../context/auth-context';
import { Button } from 'react-bootstrap';
import '../auth.scss';

export const LogIn = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const {request, errorHandler, error, cleanError} = Http();
    const [authData, setAuthData] = useState({
        email: '',
        password: ''
    });

    const setValue = event => {
        setAuthData({
            ...authData,
            [event.target.name]: event.target.value
        });
    }
    
    const identification = async () => {
        try {
            const res = await request('/user/log-in', 'post', authData, { withCredentials: true });
            auth.login(res.data.admin, res.data.token, res.data.expiresIn, res.data.userId, res.data.isLogin);
            history.push('/');
        } catch(e) {}
    }

    useEffect(() => {
        errorHandler();
    }, [error, cleanError]);

    return (
        <div className="contauner">
            <div className="form">
                <div className="blok email">
                    <label>
                        Email:
                        <input name="email" type="email" onChange={setValue} />
                    </label>
                </div>
                <div className="blok password">
                    <label>
                        Password:
                        <input name="password" type="password" onChange={setValue} />
                    </label>
                </div>
                <Button variant="primary" onClick={identification} className="btn">Accept</Button>
            </div>
        </div>
    );
}
