import React from 'react';
import './Login.css';
import { Navigate } from 'react-router-dom';
import { Authentication } from '../../components/Authentication/Authentication';

import Header from '../../components/Header/Header';
import LoginPrompt from './LoginPrompt/LoginPrompt';

function Login() {
  let [authState, setAuthState] = React.useState('idle');

  if (Authentication.isLoggedIn) {
    return (<Navigate to="/" />);
  }
  return (
    <div className="page login">
      <Header name="Login" />
      <LoginPrompt authState={authState} setAuthState={setAuthState} />
    </div>
  );
}

export default Login;
