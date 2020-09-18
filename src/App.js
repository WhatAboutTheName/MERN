import React from 'react';
import { Header } from './components/header/header';
import { AuthContext } from './context/auth-context';
import { Auth } from './hooks/auth.hook';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';


function App() {
  const {login, logout, admin, token, userId, isLogin} = Auth();
  return (
    <AuthContext.Provider value={{
      admin, token, userId, login, logout, isLogin
    }}>
      <Router>
        <Header />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
