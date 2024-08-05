import React, { useEffect, useState } from 'react';
import './Staff.css';

function StaffEvents() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [signups, setSignups] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    description: '',
    location: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStaffEvents() {
      try {
        const accessToken = localStorage.getItem('accessToken'); // Retrieve the token from local storage
        const res = await fetch(`${process.env.REACT_APP_API_URL}/staff/events`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch staff events');
        }

        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching staff events:', error);
      }
    }

    fetchStaffEvents();
  }, []);

  const fetchSignups = async (eventId) => {
    try {
      const accessToken = localStorage.getItem('accessToken'); // Retrieve the token from local storage
      const res = await fetch(`${process.env.REACT_APP_API_URL}/staff/events/${eventId}/signups`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch signups');
      }

      const data = await res.json();
      setSignups(data);
    } catch (error) {
      console.error('Error fetching signups:', error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    fetchSignups(event.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEvent),
    });

    if (res.status === 201) {
      const data = await res.json();
      setEvents((prevEvents) => [...prevEvents, data]);
      setNewEvent({
        name: '',
        date: '',
        description: '',
        location: '',
      });
      setError('');
    } else if (res.status === 403) {
      setError('Unauthorized: Only staff members can create events.');
    } else {
      setError('Failed to create event. Please try again.');
    }
  };

  return (
    <div className="content-wrapper">
      <h2>Staff Events</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <h3>Create New Event</h3>
        {error && <p className="error">{error}</p>}
        <label>
          Name:
          <input type="text" name="name" value={newEvent.name} onChange={handleChange} required />
        </label>
        <label>
          Date:
          <input type="date" name="date" value={newEvent.date} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={newEvent.description} onChange={handleChange} required />
        </label>
        <label>
          Location:
          <input type="text" name="location" value={newEvent.location} onChange={handleChange} required />
        </label>
        <button type="submit">Create Event</button>
      </form>
      <div>
        <h3>Events List</h3>
        {events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <button onClick={() => handleEventClick(event)}>
                  {event.name} - {new Date(event.date).toLocaleString()}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedEvent && (
        <div>
          <h3>Event Details: {selectedEvent.name}</h3>
          <p>Date: {new Date(selectedEvent.date).toLocaleString()}</p>
          <h4>Signups</h4>
          {signups.length === 0 ? (
            <p>No signups available.</p>
          ) : (
            <ul>
              {signups.map((signup) => (
                <li key={signup.id}>{signup.email}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default StaffEvents;
