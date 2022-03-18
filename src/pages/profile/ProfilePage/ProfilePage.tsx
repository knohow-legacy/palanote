import React from 'react';
import { NavLink } from 'react-router-dom';
import { Edit } from '@mui/icons-material';

import './ProfilePage.css';

import Pfp from './elements/Pfp';
import Banner from './elements/Banner';
import Bio from './elements/Bio';
import { Authentication } from '../../../components/Authentication/Authentication';
import Follow from './elements/Follow';

function ProfilePage({user, journals, isSelf} : any) {
    return (
        <div className="profilePage">
            <div className="profileHeader">
                <Banner src="" />
                <Pfp src={user.pfp} />
                <Bio name={user.username} bio={"Follow this user to see their posts in your home feed."} joinDate={user.timestampCreated} />
                {!Authentication.isLoggedIn && <NavLink to="/login" className="actionBtn">Login to follow</NavLink>}
                {!user.authenticated && Authentication.isLoggedIn && <Follow userId={user.id} isFollowed={user.isFollowing} />}
                {user.authenticated && <NavLink title="Edit Profile" className="actionBtn" to="/settings"><Edit /><span>Edit Profile</span></NavLink>}
            </div>
        </div>
    );
  }

export default ProfilePage;
