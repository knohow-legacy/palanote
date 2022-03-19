import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

import Header from '../../components/Header/Header';
import { API } from '../../components/API/API';
import SearchBar from '../search/SearchBar/SearchBar';

import JournalList from '../../components/JournalList/JournalList';
import { Search } from '@mui/icons-material';

function SearchUser() {
    let { username } = useParams();

    if (!username) return (<Navigate to="/search" />);

    let args = [username];

    return (
        <div className="page searchTag">
            <Header name={username} icon={<Search />} />
            <SearchBar defaultValue={username} />
            <JournalList key={username} fetchRoute={API.fetchJournalsByQuery.bind(API)} fetchArgs={args} />
        </div>
    );
}

export default SearchUser;
