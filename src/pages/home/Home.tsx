import React from 'react';
import './Home.css';
import { Navigate, Outlet } from 'react-router-dom';
import { Authentication } from '../../components/Authentication/Authentication';
import { API } from '../../components/API/API';

import Header from '../../components/Header/Header';
import JournalList from '../../components/JournalList/JournalList';
import { Home as HomeIcon } from '@mui/icons-material';

function Home() {
  if (!Authentication.isLoggedIn) {
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
