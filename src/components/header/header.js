import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Main } from '../main/main';
import Order from '../order/order';
import { Cart } from '../cart/cart';
import { AddProduct } from '../add-product/add-product';
import { SignUp } from '../auth/sign-up/sign-up';
import { LogIn } from '../auth/log-in/log-in';
import NotFound from '../not-found/not-found';
import { Http } from '../../hooks/http.hook';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './header.scss';

export const Header = () => {

  const history = useHistory();
  const auth = useSelector(state => state.auth);
  const {request, errorHandler, error, cleanError} = Http();

  const logout = async () => {
    try {
      await request('/user/logout', 'put', {userId: auth.userId}, {withCredentials: true});
      history.push('/user/log-in');
    } catch(e) {}
  }

  useEffect(() => {
    errorHandler();
  }, [error, cleanError]);

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
                {auth.isAdmin ? 
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
