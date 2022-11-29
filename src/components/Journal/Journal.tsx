import { AutoMode, Tag } from '@mui/icons-material';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, NavLink, useLocation } from 'react-router-dom'; 
import { PublishedJournal, API } from '../API/API';
import './Journal.css';
import ErrorImage from './error.png';
import JournalActions from './JournalActions/JournalActions';

function Journal({index, journal} : {index?: any, journal: PublishedJournal}) {
    const [isDeleted, setIsDeleted] = React.useState(false);
    const result = useQuery(['user', journal.authorID], async () => await API.fetchUserById(journal.authorID));
    const remixResult = useQuery(['journal', journal.remixInfo['original-journal-id']], async () => await API.fetchJournalById(journal.remixInfo['original-journal-id']), {
        enabled: !!journal.remixInfo['is-remix']
    });

    const navigate = useNavigate();
    const location = useLocation();
    
    function onClick(e:any) {
        e.preventDefault();
        navigate(`/journal/${journal.id}`, {replace: false, state: window.innerWidth > 800 ? { background: location } : undefined});
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
        <div key={index} onClick={onClick} className={"journal" + (isDeleted ? " deleted" : "")}>
            <div className="journalSvg">
                <img
                    width="100%"
                    src={API.getMediaURL('preview', journal.authorID, journal.id)}
                    alt="Journal"
                    onError={(e:any) => {e.target.onerror = null; e.target.src = ErrorImage}}
                />
                <span className="pageCount">{journal.pages} {journal.pages === 1 ? 'page' : 'pages'}</span>
            </div>
            <JournalActions expanded={false} onDelete={onDelete} toJournal={onClick} journal={journal} remixResult={remixResult} userData={result.status === 'success' ? result.data : result.status} />
        </div>
    );
}

export default Journal;
