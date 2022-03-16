import React from 'react';
import { NavLink } from 'react-router-dom';
import { Add } from '@mui/icons-material';

import './TagPage.css';

import Banner from './elements/Banner';
import TagPfp from './elements/TagPfp';
import TagBio from './elements/TagBio';
import Follow from './elements/Follow';

function ProfilePage({tag} : {tag: string}) {
    return (
        <div className="profilePage tagProfilePage">
            <div className="profileHeader">
                <Banner src="" />
                <TagPfp />
                <TagBio name={tag} />
                <Follow isFollowed={true} />
            </div>
        </div>
    );
  }

export default ProfilePage;
