import { Tag } from '@mui/icons-material';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, NavLink } from 'react-router-dom'; 
import { PublishedJournal, API } from '../API/API';
import Loading from '../Loading/Loading';
import './Journal.css';
import JournalActions from './JournalActions/JournalActions';

import loadFabricJSON from './loadFabricJSON';

function Journal({index, journal, expanded} : {index?: any, journal: PublishedJournal, expanded: boolean}) {
    const [svg, setSvg] = React.useState('');
    const result = useQuery(`user-${journal.authorID}`, async () => await API.fetchUserById(journal.authorID));

    const navigate = useNavigate();
    
    function onClick(e:any) {
        e.preventDefault();
        navigate(`/journal/${journal.id}`, {replace: false});
    }

    if (result.data) {
        loadFabricJSON(decodeURIComponent(journal.content.data)).then(svg => {setSvg(svg)});
    }

    return (
        <div key={index} onClick={expanded ? () => {} : onClick} className={"journal" + (expanded ? " expanded" : "")}>
            <h2>{journal.title}</h2>
            <div className="topics">{journal.topics.map((tag, index) => <NavLink to={`/search/tag/${tag}`} key={index} onClick={(e:any) => {e.stopPropagation()}} className="tag"><Tag />{tag}</NavLink>)}</div>
            {svg ? <div className="journalSvg" dangerouslySetInnerHTML={{__html: svg}} /> : <Loading />}
            <JournalActions toJournal={onClick} journal={journal} userData={result.status === 'success' ? result.data : result.status} />
        </div>
    );
}

export default Journal;
