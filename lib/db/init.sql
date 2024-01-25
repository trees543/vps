DROP DATABASE IF EXISTS vps;

CREATE DATABASE vps;

\c vps;

CREATE TABLE users (
  id serial PRIMARY KEY,
  name varchar(25)
);

CREATE TABLE decisions (
  id serial PRIMARY KEY,
  user_id int REFERENCES users(id) NOT NULL,
  description text,
  created timestamp DEFAULT NOW(),
  resolved boolean DEFAULT FALSE,
  resolved_date timestamp
);

CREATE TABLE options (
  id serial PRIMARY KEY,
  decision_id int REFERENCES decisions(id) NOT NULL,
  user_id int REFERENCES users(id) NOT NULL,
  option text
);