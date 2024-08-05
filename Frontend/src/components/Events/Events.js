import React, { useState, useEffect } from 'react';
import './events.css';

const Events = ({ events, signUpForEvent, addEventToGoogleCalendar, userRole, profile }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (events && events.length > 0) {
      setLoading(false);
    }
  }, [events]);

  const handleSignUp = (eventId) => {
    if (!userRole) {
      alert('You must be signed in to sign up for an event.');
      return;
    }
    signUpForEvent(eventId);
  };

  const handleAddToCalendar = (event) => {
    if (!userRole) {
      alert('You must be signed in to add an event to your Google Calendar.');
      return;
    }
    addEventToGoogleCalendar(event);
  };

  return (
    <div className="events-container">
      <h2>Events</h2>
      {loading ? (
        <p>Sorry, the backend services provider is terrible, and it might take a few minutes for the events to appear.</p>
      ) : (
        events.map(event => (
          <div key={event.id} className="event-box">
            <h3>{event.name}</h3>
            <p>{new Date(event.date).toLocaleString()}</p>
            <div className="event-actions">
              <button onClick={() => handleSignUp(event.id)}>Sign Up</button>
              <button onClick={() => handleAddToCalendar(event)}>Add to Google Calendar</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Events;
