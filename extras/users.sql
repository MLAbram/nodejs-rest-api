--
-- drop table users;
-- truncate table users;
-- select * from users limit 99;
-- insert into users (first_name_t,last_name_t,email_t) values ('Jon','Doe','jd@email.com');
create table if not exists users (
  user_id serial primary key,
  first_name_t varchar(50) not null,
  last_name_t varchar(50) not null,
  email_t varchar(50) not null,
  aud_insert_dt date default current_date not null,
  aud_insert_ts datetime(6) default current_timestamp not null,
  aud_update_ts datetime(6) null
);