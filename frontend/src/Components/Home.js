import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import your CSS file

function Home() {
  return (
    <div>
      <header className="title">Bookery</header>
    <div className='home-cont'>
      <h1 className="home-title">Welcome to Bookery</h1>
      <h2 className='head'>Please select your role</h2>
      <div className="role-links">
        <Link to="/admin" className="role-link">Admin</Link>
        <Link to="/customer" className="role-link">Customer</Link>
      </div>
    </div>
    </div>
  );
}

export default Home;
