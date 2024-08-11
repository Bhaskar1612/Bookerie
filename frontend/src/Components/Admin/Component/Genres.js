
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './this.css';

function Genres() {
    const [genres, setGenres] = useState([]);
    useEffect(() => {
    async function fetchData() {
      try {
        const genresResponse = await axios.get('http://localhost:8000/genres/');
        setGenres(genresResponse.data);
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
      <h1>Genres</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Discount</th>
          </tr>
        </thead>
        <tbody>
          {genres.map(genre => (
            <tr key={genre['Genre_ID']}>
              <td>{genre['Genre_ID']}</td>
              <td>{genre['Genre_Name']}</td>
              <td>{genre['Genre_Discount']}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/addGenre" className="link">Add a Genre</Link>
    </div>
  )
}


export default Genres