import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleViewEvents = () => {
    navigate('/events');
  };

  return (
    <section id="home">
      <h2>Welcome to Event Planner</h2>
      <p>Your one-stop solution for planning and managing events.</p>
      <button onClick={handleViewEvents}>View Events</button>
    </section>
  );
};

export default Home;
