import React, { useState, useEffect } from 'react';
import { Http } from '../../../hooks/http.hook';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { authActions } from '../../../store/actions/auth-actions';
import '../auth.scss';

export const LogIn = () => {

    const dispatch = useDispatch();
    const history = useHistory();
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
            await dispatch(authActions(res.data.admin, res.data.token, res.data.expiresIn, res.data.userId, res.data.isLogin));
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
