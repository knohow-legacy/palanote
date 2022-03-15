import { Search } from '@mui/icons-material';
import React from 'react';
import './SearchBar.css';

import Autocomplete from './Autocomplete/Autocomplete';

function SearchBar() {
    const [query, setQuery] = React.useState('');


    return (
        <div className="searchBar">
            <span className="searchBarQuery">
                <Search />
                <input onChange={(e) => {setQuery(e.target.value)}} type="text" maxLength={100} className="searchBarInput" placeholder="Search journals, users, tags..." />
            </span>
            <Autocomplete query={query} />
        </div>
    );
}

export default SearchBar;
