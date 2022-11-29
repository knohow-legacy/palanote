import React from 'react';
import './Home.css';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Authentication } from '../../components/Authentication/Authentication';
import { API } from '../../components/API/API';

import Header from '../../components/Header/Header';
import JournalList from '../../components/JournalList/JournalList';
import { Home as HomeIcon } from '@mui/icons-material';

function Home() {
  const location = useLocation();
  if (!Authentication.isLoggedIn && location.pathname === '/') {
    return (<Navigate to="/login" />);
  }
  
  return (
    <div className="page home">
      <Header icon={<HomeIcon />} name="Home" />
      <JournalList
        placeholder={"There's nothing here yet."}
        showActions={false}
        key='home'
        fetchRoute={API.fetchHome.bind(API)}
        fetchArgs={[]}
      />
      <Outlet />
    </div>
  );
}

export default Home;
