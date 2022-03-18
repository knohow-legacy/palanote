import React from 'react';
import { Comment, Favorite, AutoMode, MoreVert, Delete, Edit, Add, Remove } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import { PublishedJournal, User, API } from '../../API/API';
import './JournalActions.css';
import ContextMenu from '../../ContextMenu/ContextMenu';
import { ContentCopy } from '@mui/icons-material';

function JournalActions({toJournal, journal, userData} : {toJournal: any, journal: PublishedJournal, userData: User | string}) {
    const [isFollowing, setIsFollowing] = React.useState<null | boolean>(null);
    const [isLiked, setIsLiked] = React.useState<boolean>(journal.isLiked);
    
    const navigate = useNavigate();

    async function toggleFollowing(e:any) {
        e.preventDefault();
        e.stopPropagation();
        setIsFollowing(!isFollowing);
        setIsFollowing(await API.followUser(typeof userData === 'string' ? userData : userData.id));
    }

    async function toggleLike(e:any) {
        e.preventDefault();
        e.stopPropagation();
        if (!journal.authenticated) {
            setIsLiked(!isLiked);
            setIsLiked(await API.likeJournal(journal.id));
        }
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
                        if (window.location.href.includes("/journal/")) {
                            navigate('/', {replace: true});
                        } else {
                            window.location.reload();
                        }
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
            authenticated: true,
            isFollowing: null
        }
    } else if (typeof userData === 'string') {
        // error
        user = {
            id: '-1',
            username: '[Deleted]',
            pfp: '',
            timestampCreated: 0,
            authenticated: true,
            isFollowing: null
        }
    } else {
        user = userData;
        if (isFollowing === null) {
            setIsFollowing(user.isFollowing);
        }
    }
    
    return (
        <div className="journalActions">
            <NavLink to={`/profile/${user.id}`} onClick={user.id === '-1' ? stopPropagation : () => {}} className="author">
                <img className="authorPfp" src={user.pfp} alt={
                    user.username
                } />
                <div className="authorInfo">
                    <div className="authorName">{user.username}</div>
                    <span className="authorFollowers">{user.followers} followers</span>
                </div>
                {!user.authenticated && <div onClick={toggleFollowing} className={isFollowing ? "followBtn following" : "followBtn"}>
                    {isFollowing && <React.Fragment><Remove /><span>Unfollow</span></React.Fragment>}
                    {!isFollowing && <React.Fragment><Add /><span>Follow</span></React.Fragment>}
                </div>}
            </NavLink>
            <div className="sharing" onClick={stopPropagation}>
                <div className={"like" + (isLiked ? " liked" : journal.authenticated ? " disabled" : "")} onClick={toggleLike}>
                    <Favorite />
                    <span>{isLiked ? journal.likes + 1 : journal.likes}</span>
                </div>
                <div className="comments" onClick={toJournal}>
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
