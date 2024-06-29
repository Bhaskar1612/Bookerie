import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ASignUp.css'; // Import your CSS file

const ASignUp = () => {
  const navigate = useNavigate();
  const [memberDetails, setMemberDetails] = useState({
    Admin_ID: null,
    Admin_Name: null,
    Admin_Password: '',
  });

  useEffect(() => {
    async function fetchLastAdminId() {
      try {
        const response = await axios.get('http://localhost:8000/admins/');
        const admins = response.data;
        const lastAdmin = admins[admins.length - 1];
        const lastId = lastAdmin ? lastAdmin[0]: 0;
        setMemberDetails(prevState => ({
          ...prevState,
          Admin_ID: lastId + 1
        }));
      } catch (error) {
        console.error('Error fetching last admin ID:', error);
      }
    }

    fetchLastAdminId();
  }, []);

  const handleCreateMember = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/admins/`, memberDetails);

      console.log('Member created:', response.data);
      alert('Registration Successful');
      navigate('/admin/signin');
      // Handle success or navigate to a different page if needed
    } catch (error) {
      console.error('Error creating member:', error.response.data);
      alert('Enter a unique Admin');
      // Handle error, show an alert, etc.
    }
  };

  return (
    <div className="create-member-container">
      <h2>SignUp</h2>
      <div>
        <label>Username:</label>
        <input type="text" value={memberDetails.Admin_Name} onChange={(e) => setMemberDetails({ ...memberDetails, Admin_Name: e.target.value })} />
      </div>
      <div>
        <label>Password:</label>
        <input type="text" value={memberDetails.Admin_Password} onChange={(e) => setMemberDetails({ ...memberDetails, Admin_Password: e.target.value })} />
      </div>
      <button onClick={handleCreateMember}>SignUp</button>
    </div>
  );
};

export default ASignUp;