# Event Planner Application

This is a web application for planning and managing events, including user authentication with Google, role-based access for staff, event sign-ups, and Google Calendar integration.

## Here is the Link to the Deployed Backend and Frontend

- Backend: [https://event-planner101.xyz](https://event-planner101.xyz)
- Frontend: [https://www.event-planner-ruddy.online](https://www.event-planner-ruddy.online)
- Backend Documentation: [https://event-planner101.xyz/api-docs](https://event-planner101.xyz/api-docs)
- Local backend documentation: Access `/api-docs` at the end of the local backend URL.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js and npm installed
- PostgreSQL installed and running
- A Google Cloud project with OAuth 2.0 Client IDs set up
- Environment variables configured

## Environment Variables

Create a `.env` file in the root of both the frontend and backend directories with the following variables:

### Backend (`backend/.env`)

PG_USER=your_user        
PG_PASSWORD=your_password_for_account        
PG_HOST=localhost        
PG_PORT=5432        
PG_DATABASE=event_planner        
SESSION_SECRET=your_session_secret        
ACCESS_TOKEN_SECRET=your_jwt_secret        
GOOGLE_CLIENT_ID=your_google_client_id        
GOOGLE_CLIENT_SECRET=your_google_client_secret        
GOOGLE_REDIRECT_URI=https://event-planner-ruddy.vercel.app/auth/google/callback        

The session secret is a randomly generated String that u get to make yippy
also the access token secret is another randomly generated strign that u get to make.        
### Frontend (frontend/.env)

REACT_APP_API_URL=http://localhost:3000        
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_placeholder

## Setting Up the Backend

1. Clone the repository:

git clone https://github.com/yourusername/Event_Planner.git
cd Event_Planner/backend

2. Install dependencies:

npm install

3. Set up the PostgreSQL database:

Use the psql command to run the init.db.sql script. Here are the steps for running the script using the psql command-line tool:
- Open your terminal or command prompt.
- Connect to your PostgreSQL database:

psql -U your_username -d event_planner  

Replace your_username with your PostgreSQL username and event_planner with the name of your database.
Once connected to your database, run the script:

\i /path/to/init.db.sql
Replace /path/to/init.db.sql with the path to your SQL script file.

4. Start the backend server:

npm run dev

##Setting Up the Frontend

1. Navigate to the frontend directory:
   
cd ../frontend

2. Install dependencies:

npm install

3. Start the frontend development server:

npm start

The frontend will be running on http://localhost:3001 (or whatever the next available port is after 3000).

# Usage
## User Authentication
1. Users can sign in using their Google accounts.
2. After signing in, users can access their profile, sign up for events, and add events to their Google Calendar.
3. Staff members have additional privileges, including viewing contact form submissions and managing events.
## Profile Management
1. Users can view and update their profile information.
2. Users can view their event history on the profile page.
## Event Management
1. Users can view a list of events.
2. Users can sign up for events and add them to their Google Calendar.
3. Staff members can view and manage all events.
## Contact Form
1. Users can submit a contact form for inquiries.
2. Staff members can view all contact form submissions.
