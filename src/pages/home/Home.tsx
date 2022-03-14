import React from 'react';
import './Home.css';
import { Navigate } from 'react-router-dom';
import { Authentication } from '../../components/Authentication/Authentication';

import Header from '../../components/Header/Header';

function Home() {
  if (!Authentication.isLoggedIn) {
    return (<Navigate to="/login" />);
  }
  
  return (
    <div className="page home">
      <Header name="Home" />
      <span>code something</span>
    </div>
  );
}

export default Home;
