import React, { useContext, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import { Main } from '../main/main';
import Order from '../order/order';
import { Cart } from '../cart/cart';
import { AddProduct } from '../add-product/add-product';
import { SignUp } from '../auth/sign-up/sign-up';
import { LogIn } from '../auth/log-in/log-in';
import NotFound from '../not-found/not-found';
import { AuthContext } from '../../context/auth-context';
import { Http } from '../../hooks/http.hook';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './header.scss';

export const Header = () => {
  const history = useHistory();
  const {request, errorHandler, error, cleanError} = Http();
  const auth = useContext(AuthContext);

  const logout = async () => {
    try {
      await request('/user/logout', 'put', {userId: auth.userId}, {withCredentials: true});
      auth.logout();
    } catch(e) {}
  }

  const getData = useCallback(async () => {
    try {
      const res = await request('auth-check', 'get', null, {withCredentials: true});
      if (res.data.isLogin) {
        const authData = {email: res.data.email, password: res.data.password};
        const autoAuth = await request('/user/log-in', 'post', authData, { withCredentials: true });
        auth.login(
          autoAuth.data.admin,
          autoAuth.data.token,
          autoAuth.data.expiresIn,
          autoAuth.data.userId,
          autoAuth.data.isLogin
        );
        history.push('/');
      }
    } catch(e) {}
  }, [request]);

  useEffect(() => {
    errorHandler();
  }, [error, cleanError]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Nav  className="mr-auto">
          <span className="label">
            <NavLink className="link" to="/">MyShop</NavLink>
          </span>
        </Nav>
        <Nav>
            {auth.isLogin ? 
              <span>
                {auth.admin ? 
                  <NavLink className="link" to="/add-product">Add product</NavLink>
                  : 
                  null
                }
                <NavLink className="link" to="/cart">Cart</NavLink>
                <NavLink className="link" to="/order">Order</NavLink>
                <Button className="logoutBTN" size="sm" variant="outline-light" onClick={logout}>Logout</Button>
              </span> :
              <span>
                <NavLink className="link" to="/user/log-in">Log in</NavLink>
                <NavLink className="link" to="/user/sign-up">Sign up</NavLink>
              </span>
            }
        </Nav>
      </Navbar>
      <br />
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/Order" component={Order} />
        <Route exact path="/Cart" component={Cart} />
        <Route exact path="/add-product" component={AddProduct} />
        <Route exact path="/user/log-in" component={LogIn} />
        <Route exact path="/user/sign-up" component={SignUp} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}
