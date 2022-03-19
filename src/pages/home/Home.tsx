import React from 'react';
import './Home.css';
import { Navigate } from 'react-router-dom';
import { Authentication } from '../../components/Authentication/Authentication';
import { API } from '../../components/API/API';

import Header from '../../components/Header/Header';
import JournalList from '../../components/JournalList/JournalList';

function Home() {
  if (!Authentication.isLoggedIn) {
    return (<Navigate to="/login" />);
  }
  
  return (
    <div className="page home">
      <Header name="Home" />
      <div style={{padding: 10}}>
        <h1>Welcome home</h1>
        <p>Your followed users and topics will show up here.</p>
      </div>
      <JournalList showActions={false} key='home' fetchRoute={API.fetchHome.bind(API)} fetchArgs={[]} />
    </div>
  );
}

export default Home;
