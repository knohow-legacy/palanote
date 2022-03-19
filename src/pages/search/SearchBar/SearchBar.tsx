import { Search } from '@mui/icons-material';
import React from 'react';
import './SearchBar.css';

import { useNavigate } from 'react-router-dom';

import Autocomplete from './Autocomplete/Autocomplete';

function SearchBar({defaultValue} : {defaultValue?: string}) {
    const [query, setQuery] = React.useState('');
    const navigate = useNavigate();
    const [isOpened, setOpened] = React.useState(false);

    function navigateIfEnter(e:any) {
        if (e.keyCode === 13) {
            navigate(`/search/all/${query}`);
            e.target.blur();
            setOpened(false);
        } else if (e.target.value.length >= 3 && !isOpened) {
            setOpened(true);
        }
    }
    return (
        <div className="searchBar">
            <span className="searchBarQuery">
                <Search />
                <input
                    defaultValue={defaultValue}
                    onFocus={() => {setOpened(true)}}
                    onKeyDown={navigateIfEnter}
                    onChange={(e) => {setQuery(e.target.value)}}
                    type="text"
                    maxLength={100}
                    className="searchBarInput"
                    placeholder="Search journals, users, tags..." />
            </span>
            <Autocomplete isOpened={isOpened} setOpened={setOpened} query={query} />
        </div>
    );
}

export default SearchBar;
