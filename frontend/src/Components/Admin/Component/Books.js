
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './this.css'

function Admins() {
    const [books, setBooks] = useState([]);
    useEffect(() => {
    async function fetchData() {
      try {
        const booksResponse = await axios.get('http://localhost:8000/books/');
        setBooks(booksResponse.data);
      }
      catch(error){
        alert('Some data cannot be fetched');
        console.error('Error fetching data:', error);
      }
    }
      fetchData();
  }, []);

    return (
       <div className="Section">
      <h1>Books</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book['Book_ID']}>
              <td>{book['Book_ID']}</td>
              <td>{book['Book_Name']}</td>
              <td>{book['Book_Author']}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/addBook" className="link">Add a Book</Link>
    </div>

  )
}


export default Admins