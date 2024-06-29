import React, { useState,useEffect } from 'react';
import axios from 'axios';

const GenreAdd = () => {
  const [formData, setFormData] = useState({
    Genre_ID: '',
    Genre_Name: '',
    Genre_Discount: ''
  });

  useEffect(() => {
    async function fetchLastGenreId() {
      try {
        const response = await axios.get('http://localhost:8000/genres/');
        const genres = response.data;
        const lastGenre = genres[genres.length - 1];
        const lastId = lastGenre ? lastGenre[0]: 0;
        setFormData(prevState => ({
          ...prevState,
          Genre_ID: lastId + 1
        }));
      } catch (error) {
        console.error('Error fetching last admin ID:', error);
      }
    }

    fetchLastGenreId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/genres/', formData);
      console.log('Genre added successfully:', response.data);
      // Clear form data after submission if needed
      setFormData({
        Genre_ID: '',
        Genre_Name: '',
        Genre_Discount: ''
      });
    } catch (error) {
      alert('Invalid Genre')
      console.error('Error adding genre:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Add Genre</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="Genre_Name" placeholder="Genre Name" value={formData.Genre_Name} onChange={handleChange} />
        <input type="number" name="Genre_Discount" placeholder="Genre Discount" value={formData.Genre_Discount} onChange={handleChange} />
        <button type="submit">Add Genre</button>
      </form>
    </div>
  );
};

export default GenreAdd;
