import React from 'react';
import { NavLink } from 'react-router-dom';

import './TagPage.css';
import { Authentication } from '../../../components/Authentication/Authentication';
import { API } from '../../../components/API/API';

import Banner from './elements/Banner';
import TagPfp from './elements/TagPfp';
import TagBio from './elements/TagBio';
import Follow from './elements/Follow';
import { useQuery } from 'react-query';

function ProfilePage({tag} : {tag: string}) {
    const result = useQuery(['user', 'me'], async () => await API.fetchUserById('me'));

    return (
        <div className="profilePage tagProfilePage">
            <div className="profileHeader">
                <Banner src="" />
                <TagPfp />
                <TagBio name={tag} />
                {!Authentication.isLoggedIn && <NavLink to="/login" className="actionBtn">Login to follow</NavLink>}
                {Authentication.isLoggedIn && result.data && <Follow tag={tag} isFollowed={result.data.followedTopics.includes(tag)} />}
            </div>
        </div>
    );
  }

export default ProfilePage;
