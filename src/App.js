import React, { useEffect, useCallback } from 'react';
import { Header } from './components/header/header';
import { useDispatch } from 'react-redux';
import { authActions } from './store/actions/auth-actions';
import { Http } from './hooks/http.hook';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

function App() {

  const history = useHistory();
  const dispatch = useDispatch();
  const {request, errorHandler, error, cleanError} = Http();

  const getData = useCallback(async () => {
    try {
      const res = await request('user/auth-check', 'get', null, {withCredentials: true});
      if (res.data.isLogin) {
        const authData = {email: res.data.email, password: res.data.password};
        const autoAuth = await request('/user/log-in', 'post', authData, { withCredentials: true });
        await dispatch(
          authActions(
            autoAuth.data.admin,
            autoAuth.data.token,
            autoAuth.data.expiresIn,
            autoAuth.data.userId,
            autoAuth.data.isLogin
          )
        );
      }
      history.push('/');
    } catch(e) {}
  }, [request]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    errorHandler();
  }, [error, cleanError]);

  return (
    <Header />
  );
}

export default App;
