import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="search"
      className='search search__input'
      placeholder="Search..."
      value={query}
      onChange={handleChange}
    />
  );
};

export default SearchBar;
