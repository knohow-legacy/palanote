import React from 'react';
import './Profile.css';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from 'react-query';

import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import { API } from '../../components/API/API';

import ProfilePage from './ProfilePage/ProfilePage';
import JournalList from '../../components/JournalList/JournalList';
import { Authentication } from '../../components/Authentication/Authentication';
import { Person } from '@mui/icons-material';

function Profile() {
    let { userId } = useParams();

    const result = useQuery('user', async () => await API.fetchUserById(userId || 'me'));

    if (!userId && !Authentication.isLoggedIn) return (<Navigate to="/" />);

    return (
      <div className="page profile">
        {result.status === 'error' && <Error text="Something went wrong loading this." />}
        {result.status === 'loading' && <Loading />}
        <Header icon={<Person />} name={result.status === 'success' ? `${result.data.username}` : `Profile`} />
        {result.status === 'success' && (<React.Fragment>
            <ProfilePage user={result.data} isSelf={true} />
            <JournalList fetchRoute={API.fetchJournalsByUser.bind(API)} fetchArgs={[result.data.id]} />
        </React.Fragment>)}
      </div>
    );
}

export default Profile;
