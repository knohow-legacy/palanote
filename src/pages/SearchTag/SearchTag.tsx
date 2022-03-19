import React from 'react';
import './SearchTag.css';
import { useParams, Navigate } from 'react-router-dom';
import { Tag } from '@mui/icons-material';
import './SearchTag.css';

import Header from '../../components/Header/Header';
import { API } from '../../components/API/API';
import SearchBar from '../search/SearchBar/SearchBar';

import TagPage from './TagPage/TagPage';
import JournalList from '../../components/JournalList/JournalList';

function SearchTag() {
    let { tag } = useParams();

    tag = tag?.toLowerCase().replace(/[^a-z0-9]/g, '');

    let [storedTag, setStoredTag] = React.useState(tag);

    if (!tag) return (<Navigate to="/search" />);

    if (storedTag !== tag) {
        setStoredTag(tag);
    }

    let args = [tag];

    return (
        <div className="page searchTag">
            <Header name={tag} icon={<Tag />} />
            <SearchBar defaultValue={`#${tag}`} />
            <TagPage tag={tag} />
            <JournalList key={tag} fetchRoute={API.fetchTagByQuery.bind(API)} fetchArgs={args} />
        </div>
    );
}

export default SearchTag;
