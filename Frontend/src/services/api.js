const API_URL = process.env.REACT_APP_API_URL;

export const fetchEvents = async () => {
  const res = await fetch(`${API_URL}/events`);
  if (!res.ok) {
    throw new Error('Failed to fetch events');
  }
  return res.json();
};

export const createEvent = async (newEvent, accessToken) => {
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(newEvent),
  });

  if (!res.ok) {
    throw new Error('Failed to create event');
  }

  return res.json();
};

export const addEventToGoogleCalendar = async (eventDetails, accessToken) => {
  const res = await fetch(`${API_URL}/google-calendar/add-event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(eventDetails),
  });

  if (!res.ok) {
    throw new Error('Failed to add event to Google Calendar');
  }

  return res.json();
};

export const signUpForEvent = async (eventId, accessToken) => {
  const res = await fetch(`${API_URL}/events/${eventId}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to sign up for event');
  }

  return res.json();
};

export const verifyToken = async (token) => {
  const res = await fetch(`${API_URL}/auth/verify-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    throw new Error('Failed to verify token');
  }

  return res.json();
};

export const exchangeCodeForTokens = async (code) => {
  const res = await fetch(`${API_URL}/auth/google/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new Error(errorResponse.error || 'Failed to exchange code for tokens');
  }

  return res.json();
};
