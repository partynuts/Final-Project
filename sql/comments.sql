DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
id SERIAL PRIMARY KEY,
first VARCHAR(200) NOT NULL,
last VARCHAR(200) NOT NULL,
comment TEXT not NULL,
receivingUser_id INTEGER not null,
commentingUser_id INTEGER unique REFERENCES users(id) NOT NULL,
timeSent TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
