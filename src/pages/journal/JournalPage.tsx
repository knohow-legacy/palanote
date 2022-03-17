import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from 'react-query';

import Header from '../../components/Header/Header';
import Error from '../../components/Error/Error';
import Journal from '../../components/Journal/Journal';
import { API, PublishedJournal } from '../../components/API/API';
import Loading from '../../components/Loading/Loading';

function JournalPage() {
    let { journalId } = useParams();
    const result = useQuery(`journal-${journalId}`, async () => await API.fetchJournalById(journalId || ""));

    if (!journalId) return <Navigate to="/" />;

    return (
        <div className="page journalPage">
            <Header name={result.status === 'success' ? (result.data as PublishedJournal).title : 'Journal'} />
            {result.status === 'loading' && <Loading />}
            {result.status === 'error' && <Error text="Journal not found." />}
            {result.status === 'success' && <Journal expanded={true} journal={result.data as PublishedJournal} />}
        </div>
    );
}

export default JournalPage;
