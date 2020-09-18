import React, { useState, useEffect } from 'react';
import { Http } from '../../../hooks/http.hook';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../auth.scss';

export const SignUp = () => {
    const history = useHistory();
    const {request , errorHandler, error, cleanError} = Http();
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const setValue = event => {
        setUser({
            ...user, [event.target.name]: event.target.value
        });
    }

    const signup = async () => {
        try {
            await request('/user/signup', 'put', user);
            history.push('/user/log-in');
        } catch(e) {}
    }

    useEffect(() => {
        errorHandler();
    }, [error, cleanError]);

    return (
        <div className="contauner">
            <div className="form">
                <div className="blok name">
                    <label>
                        Name:
                        <input name="name" type="text" onChange={setValue} />
                    </label>
                </div>
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
                <div className="blok phone_number">
                    <label>
                        Phone number:
                        <input name="phoneNumber" type="phoneNumber" onChange={setValue} />
                    </label>
                </div>
                <Button variant="primary" onClick={signup} className="btn">accept</Button>
            </div>
        </div>
    );
}
