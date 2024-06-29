import React from 'react';
import { Link } from 'react-router-dom';
import './CustomerPage.css'; // Import your CSS file

function CustomerPage() {
  return (
    <div className="customer-cont">
      <h2 className="customer-title">Customer Credentials</h2>
      {/* Add your customer sign-in form here */}
      <div className="customer-links">
        <Link to="/customer/signup" className="customer-link">Sign Up as Customer</Link>
        <Link to="/customer/signin" className="customer-link">Sign In as Customer</Link>
      </div>
    </div>
  );
}

export default CustomerPage;
