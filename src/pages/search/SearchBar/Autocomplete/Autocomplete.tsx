import { FindInPage, PersonSearch, Tag, Search } from '@mui/icons-material';
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../SearchBar.css';

function SearchBar({query, isOpened, setOpened} : {query: string, isOpened: any, setOpened: any}) {
    if (query.length < 3 || !isOpened) {
        return <div className="autocomplete" />;
    }

    let tag = (query.includes('#') ? query.split("#")[1] : query).split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    return (
        <div className="autocomplete" onClick={() => {setOpened(false)}}>
            <NavLink to={`/search/all/${query}`} key="all" className="autocompleteItem">
                <Search />
                <span>Search everything for <b>{query}</b></span>
            </NavLink>
            {tag && <NavLink to={`/search/tag/${tag}`} key="tag" className="autocompleteItem">
                <Tag />
                <span>Search for <b>#{tag}</b></span>
            </NavLink>}
            <NavLink to={`/search/user/${query}`} key="person" className="autocompleteItem">
                <PersonSearch />
                <span>Search for journals by user <b>{query}</b></span>
            </NavLink>
            <NavLink to={`/search/journal/${query}`} key="title" className="autocompleteItem">
                <FindInPage />
                <span>Search for journals named <b>{query}</b></span>
            </NavLink>
        </div>
    );
}

export default SearchBar;
