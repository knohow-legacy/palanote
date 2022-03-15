import React from 'react';
import { NavLink } from 'react-router-dom';
import { Edit } from '@mui/icons-material';

import './ProfilePage.css';

import Pfp from './elements/Pfp';
import Banner from './elements/Banner';
import Bio from './elements/Bio';

function ProfilePage({user, journals, isSelf} : any) {
    return (
        <div className="profilePage">
            <div className="profileHeader">
                <Banner src="" />
                <Pfp src={user.pfp} />
                <Bio name={user.username} bio={"Hello! This is sample text. Ideally we'd have a bio setting in the database at some point?"} joinDate={user.timestampCreated} />
                {isSelf && <NavLink title="Edit Profile" className="editProfile" to="/settings"><Edit /><span>Edit Profile</span></NavLink>}
            </div>
        </div>
    );
  }

export default ProfilePage;
