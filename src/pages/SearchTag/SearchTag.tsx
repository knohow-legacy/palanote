import React from 'react';
import './SearchTag.css';

import Header from '../../components/Header/Header';
import SearchBar from '../search/SearchBar/SearchBar';

function Search() {
  return (
    <div className="page search">
      <Header name="Search" />
      <SearchBar />
    </div>
  );
}

export default Search;
