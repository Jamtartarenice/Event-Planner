import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import './styles/App.css';
import Events from './components/Events/Events';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Home from './components/Home/Home';
import StaffEvents from './components/Staff/Staff';
import Profile from './components/Profile/Profile';
import Settings from './components/Settings/Settings';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import Terms from './components/Terms/Terms';
import Footer from './components/Footer/Footer';

function App() {
  const [events, setEvents] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthorizationCodeFromURL = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/google/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          if (!res.ok) {
            const errorResponse = await res.json();
            console.error('Error response:', errorResponse);
            throw new Error(errorResponse.error || 'Failed to exchange code for tokens');
          }

          const data = await res.json();
          localStorage.setItem('accessToken', data.accessToken);
          setUserRole(data.role);
          setProfile(data.profile);

          window.history.replaceState({}, document.title, '/');
          navigate('/');
        } catch (error) {
          console.error('Error exchanging code for tokens:', error);
        }
      }
    };

    const verifyToken = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          if (!res.ok) {
            throw new Error('Failed to verify token');
          }

          const data = await res.json();
          localStorage.setItem('accessToken', data.accessToken);
          setUserRole(data.role);
          setProfile(data.profile);
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('accessToken');
        }
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/events`);
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    const initialize = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await verifyToken();
      }

      await handleAuthorizationCodeFromURL();
      fetchEvents();
    };

    initialize();
  }, [location.search, navigate, location.pathname]);

  const signUpForEvent = async (eventId) => {
    if (!localStorage.getItem('accessToken')) {
      alert('You must be signed in to sign up for an event.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/events/${eventId}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to sign up for event');
      }

      await res.json();
      alert('Successfully signed up for the event!');
    } catch (error) {
      console.error('Error signing up for event:', error);
    }
  };

  const addEventToGoogleCalendar = async (event) => {
    if (!localStorage.getItem('accessToken')) {
      alert('You must be signed in to add an event to Google Calendar.');
      return;
    }

    const { name, date } = event;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + 1);

    const accessToken = localStorage.getItem('accessToken');
    const startDateTime = startDate.toISOString();
    const endDateTime = endDate.toISOString();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/google-calendar/add-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          summary: name,
          description: name,
          startDateTime,
          endDateTime,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to add event to Google Calendar');
      }

      await res.json();
      alert('Event added to Google Calendar successfully!');
    } catch (error) {
      console.error('Error adding event to Google Calendar:', error);
    }
  };

  const initiateGoogleAuth = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  const makeUserStaff = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/make-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to make user staff');
      }

      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      setUserRole('staff');
      setProfile(data.profile);
    } catch (error) {
      console.error('Error making user staff:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  };

  return (
    <div className="App">
      <header>
        <h1>Event Planner</h1>
        <div className="header-right">
          {userRole && (
            <button className="make-staff-button" onClick={makeUserStaff}>
              Make me Staff
            </button>
          )}

          {!userRole ? (
            <button className="google-signin-button" onClick={initiateGoogleAuth}>
              Sign in with Google
            </button>
          ) : (
            <div className="profile">
              <div onClick={() => navigate('/profile')} className="profile-link">
                Profile
              </div>
              <div className="dropdown-content">
                <Link to="/profile">View Profile</Link>
                <Link to="/settings">Settings</Link>
                <button className="dropdown-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms and Service</Link></li>
            {userRole === 'staff' && <li><Link to="/staff">Staff</Link></li>}
          </ul>
        </nav>
      </header>
      <main className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events events={events} signUpForEvent={signUpForEvent} addEventToGoogleCalendar={addEventToGoogleCalendar} userRole={userRole} profile={profile} loading={loading} />} />
          <Route path="/contact" element={<Contact profile={profile} />} />
          <Route path="/staff" element={<StaffEvents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/auth/google/callback" element={<div>Loading...</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
