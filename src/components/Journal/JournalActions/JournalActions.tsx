import React from 'react';
import { Comment, Favorite, AutoMode } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { PublishedJournal, User } from '../../API/API';
import './JournalActions.css';

function JournalActions({journal, user} : {journal: PublishedJournal, user: User | null}) {
    return (
        <div className="journalActions">
            {user && <NavLink to={`/profile/${user.id}`} className="author">
                <img className="authorPfp" src={user.pfp} alt={user.username} />
                <div className="authorInfo">
                    <div className="authorName">{user.username}</div>
                    <span className="authorFollowers">0 followers</span>
                </div>
            </NavLink>}
            <div className="sharing">
                <div className="favorite">
                    <Favorite />
                    <span>{journal.likes}</span>
                </div>
                <div className="comments">
                    <Comment />
                    <span>{journal.comments.length}</span>
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
