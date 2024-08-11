import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSignUp.css'; // Import your CSS file

const CSignUp = () => {
  const navigate = useNavigate();
  const [memberDetails, setMemberDetails] = useState({
    Customer_ID:null,
    Customer_Name: '',
    Customer_Email: '',
    Customer_Password: '',
    Customer_Phone: '',
    Customer_Address: '',
  });

  useEffect(() => {
    async function fetchLastCustomerId() {
      try {
        const response = await axios.get('http://localhost:8000/customers/');
        const customers = response.data;
        const lastCustomer = customers[customers.length - 1];
        const lastId = lastCustomer ? lastCustomer['Customer_ID']: 0;
        setMemberDetails(prevState => ({
          ...prevState,
          Customer_ID: lastId + 1
        }));
      } catch (error) {
        console.error('Error fetching last customer ID:', error);
      }
    }

    fetchLastCustomerId();
  }, []);



  const handleCreateMember = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/customers/`, memberDetails);

      console.log('Member created:', response.data);
      alert('Registration Successful');
      navigate('/customer/signin');
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
        <input type="text" value={memberDetails.Customer_Name} onChange={(e) => setMemberDetails({ ...memberDetails, Customer_Name: e.target.value })} />
      </div>
      <div>
        <label>Customer_Email:</label>
        <input type="texr" value={memberDetails.Customer_Email} onChange={(e) => setMemberDetails({ ...memberDetails, Customer_Email: e.target.value })} />
      </div>
      <div>
        <label>Password:</label>
        <input type="text" checked={memberDetails.Customer_Password} onChange={(e) => setMemberDetails({ ...memberDetails, Customer_Password: e.target.value })} />
      </div>
      <div>
        <label>Customer_Phone:</label>
        <input type="text" checked={memberDetails.Customer_Phone} onChange={(e) => setMemberDetails({ ...memberDetails, Customer_Phone: e.target.value })} />
      </div>
      <div>
        <label>Customer_Address:</label>
        <input type="text" checked={memberDetails.Customer_Address} onChange={(e) => setMemberDetails({ ...memberDetails, Customer_Address: e.target.value })} />
      </div>
      <button onClick={handleCreateMember}>SignUp</button>
    </div>
  );
};

export default CSignUp;