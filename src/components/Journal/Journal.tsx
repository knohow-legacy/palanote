import { Tag } from '@mui/icons-material';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, NavLink } from 'react-router-dom'; 
import { PublishedJournal, User, DefaultUser, API } from '../API/API';
import './Journal.css';
import JournalActions from './JournalActions/JournalActions';

function Journal({index, journal, expanded} : {index?: any, journal: PublishedJournal, expanded: boolean}) {
    const result = useQuery('user', async () => await API.fetchUserById(journal.authorID));

    const navigate = useNavigate();
    
    function onClick(e:any) {
        e.preventDefault();
        navigate(`/journal/${journal.id}`, {replace: true});
    }

    return (
        <div key={index} onClick={expanded ? () => {} : onClick} className={"journal" + (expanded ? " expanded" : "")}>
            <h2>{journal.title}</h2>
            <div className="topics">{journal.topics.map((tag, index) => <NavLink to={`/search/tag/${tag}`} key={index} onClick={(e:any) => {e.stopPropagation()}} className="tag"><Tag />{tag}</NavLink>)}</div>
            <div className="journalSvg" dangerouslySetInnerHTML={{__html: decodeURIComponent(journal.content.data)}} />
            <JournalActions journal={journal} userData={result.status === 'success' ? result.data : result.status} />
        </div>
    );
}

export default Journal;
