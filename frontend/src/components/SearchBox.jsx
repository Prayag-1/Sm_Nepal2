import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = ({ inputRef }) => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  // FIX: uncontrolled input - urlKeyword may be undefined
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex header-search search-pill'>
      <Form.Control
        ref={inputRef}
        type='search'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Search products...'
        className='search-input'
        aria-label='Search products'
      />
      <Button
        type='submit'
        variant='link'
        className='search-icon-btn'
        aria-label='Submit search'
      >
        <FaSearch />
      </Button>
    </Form>
  );
};

export default SearchBox;
