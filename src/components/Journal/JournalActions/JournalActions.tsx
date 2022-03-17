import React from 'react';
import { Comment, Favorite, AutoMode, MoreVert, Delete, Edit } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { PublishedJournal, User, API } from '../../API/API';
import './JournalActions.css';
import ContextMenu from '../../ContextMenu/ContextMenu';
import { ContentCopy } from '@mui/icons-material';

function JournalActions({journal, userData} : {journal: PublishedJournal, userData: User | string}) {
    function preventDefault(e:any) {
        e.preventDefault()
    }
    function stopPropagation(e:any) {
        e.stopPropagation()
    }

    const dropdownItems = [
        {
            label: 'Copy Link',
            icon: <ContentCopy />,
            className: '',
            href: '',
            onClick: (e:any) => {
                navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#/journal/${journal.id}`);
            }
        }
    ]

    if (journal.authenticated) {
        dropdownItems.push(
            {
                label: 'Edit',
                icon: <Edit />,
                className: '',
                href: `/compose/${journal.id}`,
                onClick: (e:any) => {}
            },
            {
                label: 'Delete',
                icon: <Delete />,
                className: 'danger',
                href: '',
                onClick: async (e:any) => {
                    let result = await API.deleteJournalbyId(journal.id);
                    if (result) {
                        window.location.reload();
                    } else {
                        alert('Failed to delete journal.');
                    }
                }
            }
        )
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
            <NavLink to={`/profile/${user.id}`} onClick={user.id === '-1' ? preventDefault : () => {}} className="author">
                <img className="authorPfp" src={user.pfp} alt={
                    user.username
                } />
                <div className="authorInfo">
                    <div className="authorName">{user.username}</div>
                    <span className="authorFollowers">{user.followers} followers</span>
                </div>
            </NavLink>
            <div className="sharing" onClick={stopPropagation}>
                <div className="favorite">
                    <Favorite />
                    <span>{journal.likes}</span>
                </div>
                <div className="comments">
                    <Comment />
                    <span>{journal.comments}</span>
                </div>
                <NavLink to={`/remix/${journal.id}`} className={journal.remixInfo['allow-remix'] ? "remixes" : "remixes disabled"}>
                    <AutoMode />
                    <span>{journal.remixInfo.remixes}</span>
                </NavLink>
                <ContextMenu direction="up" title="Context Menu" items={dropdownItems}>
                    <MoreVert />
                </ContextMenu>
            </div>
        </div>
    );
}

export default JournalActions;
