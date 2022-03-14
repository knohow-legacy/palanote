import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

import Header from '../../components/Header/Header';
import Error from '../../components/Error/Error';
import Journal from '../../components/Journal/Journal';
import { API, PublishedJournal } from '../../components/API/API';

function JournalPage() {
    let [data, setData] = React.useState<{journal : PublishedJournal | null | false, request: boolean}>({journal: null, request: false});
    let { journalId } = useParams();

    if (!journalId) return <Navigate to="/" />;

    if (!data.request && data.journal === null) {
        // only fetch on first mount
        API.fetchJournalById(journalId).then((result) => {
            setData({journal: result.success ? result.journal : false, request: false});
        });

        setData({journal: data.journal, request: true});
        
    }

    return (
        <div className="page journalPage">
            <Header name={data.journal ? data.journal.title : 'Journal'} />
            {data.journal === false && <Error text="Journal not found." />}
            {data.journal && <Journal expanded={true} journal={data.journal} />}
        </div>
    );
}

export default JournalPage;
