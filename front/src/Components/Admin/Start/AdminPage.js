import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css'; // Import your CSS file

function AdminPage() {
  return (
    <div className="admin-cont">
      <h2 className="admin-title">Admin Credentials</h2>
      {/* Add your admin sign-in form here */}
      <div className="admin-links">
        <Link to="/admin/signup" className="a-link">Sign Up as Admin</Link>
        <Link to="/admin/signin" className="a-link">Sign In as Admin</Link>
      </div>
    </div>
  );
}

export default AdminPage;
