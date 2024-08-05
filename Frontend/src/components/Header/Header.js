import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ initiateGoogleAuth, userRole }) {
  return (
    <header>
      <h1>Event Planner</h1>
      <div id="signInDiv" className="sign-in-button"></div>
      <button onClick={initiateGoogleAuth}>Sign in with Google</button>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {userRole === 'staff' && <li><Link to="/staff">Staff</Link></li>}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
