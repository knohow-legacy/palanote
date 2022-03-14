import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { PublishedJournal, User, DefaultUser, API } from '../API/API';
import './Journal.css';
import JournalActions from './JournalActions/JournalActions';

function Journal({index, journal, expanded} : {index?: any, journal: PublishedJournal, expanded: boolean}) {
    const [data, setData] = React.useState<{user: User | null, request: boolean}>({user: null, request: false});
    const navigate = useNavigate();

    if (data.user === null && data.request === false) {
        API.fetchUserById(journal.authorID).then((result) => {
            setData({user: result.success ? result.user : DefaultUser, request: false});
        });
    }
    function onClick(e:any) {
        e.preventDefault();
        navigate(`/journal/${journal.id}`, {replace: true});
    }

    return (
        <div key={index} onClick={expanded ? () => {} : onClick} className={"journal" + (expanded ? " expanded" : "")}>
            {!expanded && <h2>{journal.title}</h2>}
            <div className="journalSvg" dangerouslySetInnerHTML={{__html: decodeURIComponent(journal.content.data)}} />
            <JournalActions journal={journal} user={data.user} />
        </div>
    );
}

export default Journal;
