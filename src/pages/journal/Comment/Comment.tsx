import React from 'react';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import Error from '../../../components/Error/Error';
import Loading from '../../../components/Loading/Loading';
import { API, Comment as CommentSchema } from '../../../components/API/API';

import './Comment.css';

function Comment({comment} : {comment : CommentSchema}) {
    const result = useQuery(['user', comment.user], async () => await API.fetchUserById(comment.user));

    return (
        <div className="comment">
            {result.status === 'loading' && <Loading />}
            {result.status === 'error' && <Error text="Couldn't load this comment." />}
            {result.data && (<React.Fragment>
                <NavLink to={`/profile/${result.data.id}`} className="author">
                    <img className="authorPfp" src={result.data.pfp} alt={result.data.username} />
                    <div className="authorInfo">
                        <div className="authorName">{result.data.username}</div>
                        <span className="authorFollowers">{result.data.followers} {result.data.followers === 1 ? 'follower' : 'followers'}</span>
                    </div>
                </NavLink>
                <div className="content">
                    {comment.content}
                </div>
            </React.Fragment>)}
        </div>
    );
}

export default Comment;
