import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './profile.css';

function Profile() {
  const [profile, setProfile] = useState({});
  const [eventHistory, setEventHistory] = useState([]);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProfile(data.profile);
      setEventHistory(data.eventHistory);
    };

    fetchProfile();
  }, []);

  const handleError = () => {
    setImgError(true);
  };

  return (
    <div>
      <h2>Profile</h2>
      {imgError ? (
        <div className="fallback-img">Profile Image Not Available</div>
      ) : (
        <img
          src={profile.picture || profile.google_picture_url || '/default-profile.png'}
          alt="Profile"
          className="profile-picture"
          onError={handleError}
        />
      )}
      <p>Email: {profile.email}</p>
      <Link to="/settings">Settings</Link>
      
      <Link to="/logout">Logout</Link>
      <h3>Event History</h3>
      <ul>
        {eventHistory.map((event) => (
          <li key={event.id}>{event.name} - {event.date}</li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
