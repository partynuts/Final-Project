DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
id SERIAL PRIMARY KEY,
comment TEXT not NULL,
receivingUser_id INTEGER not null,
commentingUser_id INTEGER REFERENCES users(id) NOT NULL,
timeSent TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
