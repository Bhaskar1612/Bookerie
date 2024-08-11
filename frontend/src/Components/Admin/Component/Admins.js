
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admins() {
    const [admins, setAdmins] = useState([]);
    useEffect(() => {
    async function fetchData() {
      try {
        const adminsResponse = await axios.get('http://localhost:8000/admins/');
        setAdmins(adminsResponse.data);
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
       <h1>Admins</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin['Admin_ID']}>
              <td>{admin['Admin_ID']}</td>
              <td>{admin['Admin_Name']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


export default Admins