
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './this.css';

function Partners() {
    const [partners, setPartners] = useState([]);
    useEffect(() => {
    async function fetchData() {
      try {
        const partnersResponse = await axios.get('http://localhost:8000/delivery-partners/');
        setPartners(partnersResponse.data);
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
      <h1>Partners</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {partners.map(partner => (
            <tr key={partner['Partner_ID']}>
              <td>{partner['Partner_ID']}</td>
              <td>{partner['Partner_Name']}</td>
              <td>{partner['Partner_Email']}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/addPartner" className="link">Add a Delivery Partner</Link>
    </div>
  )
}


export default Partners