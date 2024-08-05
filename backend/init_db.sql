-- Drop existing tables if they exist
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS event_signups;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- Drop existing sequences if they exist
DROP SEQUENCE IF EXISTS users_id_seq;
DROP SEQUENCE IF EXISTS events_id_seq;
DROP SEQUENCE IF EXISTS event_signups_id_seq;
DROP SEQUENCE IF EXISTS contacts_id_seq;

-- Create sequences
CREATE SEQUENCE users_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE events_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE event_signups_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE contacts_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Create users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY DEFAULT nextval('users_id_seq'::regclass),
    email character varying(255) NOT NULL UNIQUE,
    password character varying(255) NOT NULL,
    role character varying(10) DEFAULT 'user',
    google_access_token text,
    name character varying(255),
    picture character varying(255),
    google_picture_url character varying
);

-- Create events table
CREATE TABLE events (
    id BIGINT PRIMARY KEY DEFAULT nextval('events_id_seq'::regclass),
    name character varying(255),
    date date,
    description text,
    location character varying(255)
);

-- Create event_signups table
CREATE TABLE event_signups (
    id BIGINT PRIMARY KEY DEFAULT nextval('event_signups_id_seq'::regclass),
    event_id BIGINT REFERENCES events(id),
    user_id BIGINT REFERENCES users(id)
);

-- Create contacts table
CREATE TABLE contacts (
    id BIGINT PRIMARY KEY DEFAULT nextval('contacts_id_seq'::regclass),
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    message text NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test users
INSERT INTO users (id, email, password, role, google_access_token, name, google_picture_url) VALUES 
    (1, 'example@example.com', 'password', 'user', NULL, 'Example User', 'https://lh3.googleusercontent.com/a/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
    (2, 'jmaladyn@gmail.com', '', 'staff', 'https://lh3.googleusercontent.com/a/aaaaaaaaaaaaaaaaaaaaaaaaa');

-- Insert test events
INSERT INTO events (name, date, description, location) VALUES 
    ('Annual Conference', '2024-07-20', 'Description for Annual Conference', 'Conference Hall A'),
    ('Summer Festival', '2024-08-15', 'Description for Summer Festival', 'Central Park'),
    ('Tech Expo', '2024-09-10', 'Description for Tech Expo', 'Exhibition Center'),
    ('Music Concert', '2024-10-05', 'Description for Music Concert', 'Downtown Arena'),
    ('Art Exhibition', '2024-11-22', 'Description for Art Exhibition', 'City Gallery'),
    ('Food Carnival', '2024-12-13', 'Description for Food Carnival', 'Riverside Park');

-- Insert test event signups
INSERT INTO event_signups (event_id, user_id) VALUES 
    (1, 1),
    (2, 2),
    (3, 1),
    (4, 2),
    (5, 1),
    (6, 2);

-- Insert test contact messages
INSERT INTO contacts (name, email, message) VALUES 
    ('John Doe', 'johndoe@example.com', 'I would like more information about the annual conference.'),
    ('Jane Smith', 'janesmith@example.com', 'How can I volunteer for the summer festival?'),
    ('Alice Johnson', 'alicej@example.com', 'Can I get a booth at the tech expo?'),
    ('Bob Brown', 'bobbrown@example.com', 'Looking forward to the music concert!'),
    ('Emily Davis', 'emilydavis@example.com', 'Interested in participating in the art exhibition.');
