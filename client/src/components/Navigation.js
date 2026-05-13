import React from 'react';
import { Link } from 'react-router-dom';

function Navigation({ user, onLogout }) {
  return (
    <nav>
      <ul>
        <li className="nav-title">
          <Link to="/">⚽ Sportova Noc</Link>
        </li>
        <li className="nav-links">
          <Link to="/">Events</Link>
          {user ? (
            <>
              <Link to="/create-event">Create Event</Link>
              <Link to="/profile">Profile</Link>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;