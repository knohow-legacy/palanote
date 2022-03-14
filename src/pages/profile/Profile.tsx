import React from 'react';
import './Profile.css';
import { useParams, Navigate } from 'react-router-dom';
import { Authentication } from '../../components/Authentication/Authentication';
import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import { API, PublishedJournal, User } from '../../components/API/API';

import ProfilePage from './ProfilePage/ProfilePage';
import JournalList from '../../components/JournalList/JournalList';

function Profile() {
    let { userId } = useParams();
    let [data, setData] = React.useState<{user: null | User | false, journals: null | Array<PublishedJournal>, request: boolean}>({user: null, journals: null, request: false});

    // only fetch on first mount
    if (!data.request) {
        if (data.user === null) {
            if (userId === undefined && !Authentication.isLoggedIn) {
                return (<Navigate to="/login" />);
            } else {
                // Fetch user or self
                API.fetchUserById(userId || 'me').then((result) => {
                    if (result.success) {
                        setData({user: result.user, journals: data.journals, request: false});
                    } else {
                        setData({user: false, journals: data.journals, request: false});
                    }
                });
            }
        } else if (data.journals === null) {
            // Fetch journals
            API.fetchJournalsByUser((data.user as User).id).then((result) => {
                if (result.success) {
                    setData({user: data.user, journals: result.journals, request: false});
                } else {
                    setData({user: data.user, journals: [], request: false});
                }
            });
        }
        setData({user: data.user, journals: data.journals, request: true});
    }
    
    


    return (
      <div className="page profile">
        {data.user === false && <Error text="Something went wrong loading this." />}
        {data.user === null && <Loading />}
        <Header name={data.user ? `${data.user.username}` : `Profile`} />
        {data.user && <ProfilePage user={data.user} isSelf={true} />}
        {!data.journals && <Loading />}
        {data.journals && <JournalList journals={data.journals} />}
      </div>
    );
  }

export default Profile;
