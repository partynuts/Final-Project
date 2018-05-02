drop table if exists friendships;

create table friendships (
id SERIAL PRIMARY KEY,
sender_id INTEGER not null,
receiver_id INTEGER not null,
status INTEGER not null,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
