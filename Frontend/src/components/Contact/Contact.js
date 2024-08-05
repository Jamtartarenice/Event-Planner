import React, { useState, useEffect } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isStaff, setIsStaff] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        setIsStaff(data.profile.role === 'staff');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (isStaff) {
      const fetchContacts = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/contacts`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error('Failed to fetch contacts');
          }

          const data = await res.json();
          setContacts(data);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      };

      fetchContacts();
    }
  }, [isStaff]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit contact form');
      }

      setFormData({ name: '', email: '', message: '' });
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  return (
    <div className="Contact">
      <h2>Contact Us</h2>
      {isStaff ? (
        <div className="contacts-container">
          {contacts.map((contact) => (
            <ContactMessage key={contact.id} contact={contact} />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Message:</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

function ContactMessage({ contact }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="contact-message">
      <div className="contact-header" onClick={() => setExpanded(!expanded)}>
        <span>{contact.name} ({contact.email})</span>
        <button>{expanded ? 'Hide' : 'Show'} Message</button>
      </div>
      {expanded && <p>{contact.message}</p>}
    </div>
  );
}

export default Contact;
