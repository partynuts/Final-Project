drop table if exists users cascade;

create table users(
  id serial primary key,
  first varchar(250) not null,
  last varchar(250) not null,
  email varchar(250) not null unique,
  pw varchar(250) not null
);
