import React from 'react';
import './Search.css';
import {Search as SearchIcon} from '@mui/icons-material';

import Header from '../../components/Header/Header';
import SearchBar from './SearchBar/SearchBar';

function Search() {
  return (
    <div className="page search">
      <Header name="Search" icon={<SearchIcon /> } />
      <SearchBar />
    </div>
  );
}

export default Search;
