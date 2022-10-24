import React from 'react';
import './Login.css';
import { Login as LoginIcon } from '@mui/icons-material';
import { Navigate } from 'react-router-dom';
import { Authentication } from '../../components/Authentication/Authentication';

import Header from '../../components/Header/Header';
import LoginPrompt from './LoginPrompt/LoginPrompt';

function Login() {
  let [authState, setAuthState] = React.useState('idle');

  if (Authentication.isLoggedIn) {
    if (window.location.hash.includes('redirect=')) {
      let redirect = decodeURIComponent(window.location.hash.split('redirect=')[1]);
      return (<Navigate to={redirect} />);
    }
    return (<Navigate to="/" />);
  }
  return (
    <div className="page login">
      <Header icon={<LoginIcon />} name="Login" />
      <LoginPrompt authState={authState} setAuthState={setAuthState} />
    </div>
  );
}

export default Login;
