import React from 'react';
import { Comment, Favorite, AutoMode } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { PublishedJournal, User } from '../../API/API';
import './JournalActions.css';

function JournalActions({journal, userData} : {journal: PublishedJournal, userData: User | string}) {
    function userClick(e:any) {
        e.preventDefault()
    }

    let user;
    if (userData === 'loading') {
        user = {
            id: '-1',
            username: '',
            pfp: '',
            timestampCreated: 0,
        }
    } else if (typeof userData === 'string') {
        // error
        user = {
            id: '-1',
            username: '[Deleted]',
            pfp: '',
            timestampCreated: 0,
        }
    } else {
        user = userData;
    }
    
    return (
        <div className="journalActions">
            <NavLink to={`/profile/${user.id}`} onClick={user.id === '-1' ? userClick : () => {}} className="author">
                <img className="authorPfp" src={user.pfp} alt={
                    user.username
                } />
                <div className="authorInfo">
                    <div className="authorName">{user.username}</div>
                    <span className="authorFollowers">{user.followers} followers</span>
                </div>
            </NavLink>
            <div className="sharing">
                <div className="favorite">
                    <Favorite />
                    <span>{journal.likes}</span>
                </div>
                <div className="comments">
                    <Comment />
                    <span>{journal.comments}</span>
                </div>
                <div className="remixes">
                    <AutoMode />
                    <span>{journal.remixInfo.remixes}</span>
                </div>
            </div>
        </div>
    );
}

export default JournalActions;
