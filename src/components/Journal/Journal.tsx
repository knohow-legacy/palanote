import { AutoMode, Tag } from '@mui/icons-material';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, NavLink } from 'react-router-dom'; 
import { PublishedJournal, API } from '../API/API';
import './Journal.css';
import ErrorImage from './error.png';
import JournalActions from './JournalActions/JournalActions';

function Journal({index, journal, expanded} : {index?: any, journal: PublishedJournal, expanded: boolean}) {
    const [isDeleted, setIsDeleted] = React.useState(false);
    const result = useQuery(['user', journal.authorID], async () => await API.fetchUserById(journal.authorID));
    const remixResult = useQuery(`journal-${journal.remixInfo['original-journal-id']}`, async () => await API.fetchJournalById(journal.remixInfo['original-journal-id']), {
        enabled: !!journal.remixInfo['is-remix']
    });

    const navigate = useNavigate();
    
    function onClick(e:any) {
        e.preventDefault();
        navigate(`/journal/${journal.id}`, {replace: false});
        window.scrollTo(0, 0); // scroll to top
    }

    function onDelete() {
        if (window.location.href.includes("/journal/")) {
            navigate('/', {replace: true});
        } else {
            setIsDeleted(true);
        }
    }

    return (
        <div key={index} onClick={expanded ? () => {} : onClick} className={"journal" + (expanded ? " expanded" : "") + (isDeleted ? " deleted" : "")}>
            <h2>
                {journal.title}
                {remixResult.data ?
                    (<NavLink
                        onClick={(e) => {e.stopPropagation()}}
                        to={`/journal/${journal.remixInfo['original-journal-id']}`}
                        className="remix"
                    >
                        <AutoMode />
                        <span>Remix of {remixResult.data.title}</span>
                    </NavLink>) : ''}
            </h2>
            <b>{new Date(journal.timestampCreated).toDateString()}</b>
            <div className="topics">{journal.topics.map((tag, index) => <NavLink to={`/search/tag/${tag}`} key={index} onClick={(e:any) => {e.stopPropagation()}} className="tag"><Tag />{tag}</NavLink>)}</div>
            <div className="journalSvg">
                <img
                    width="100%"
                    src={API.getMediaURL('svg', journal.authorID, journal.id)}
                    alt="Journal"
                    onError={(e:any) => {e.target.onerror = null; e.target.src = ErrorImage}}
                />
            </div>
            <JournalActions onDelete={onDelete} toJournal={onClick} journal={journal} userData={result.status === 'success' ? result.data : result.status} />
        </div>
    );
}

export default Journal;
