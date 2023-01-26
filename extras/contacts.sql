--
-- drop table contacts;
-- truncate table contacts;
-- select * from contacts where user_id = 1 limit 99;
-- insert into contacts (user_id,first_name_t,last_name_t) values (1,'First','Contact');
create table if not exists contacts (
  contact_id serial primary key,
  user_id bigint not null,
  first_name_t varchar(50) null,
  last_name_t varchar(50) null,
  email_t varchar(50) null,
  phone_t varchar(20) null,
  addr1_t varchar(50) null,
  addr2_t varchar(50) null,
  city_t varchar(50) null,
  state_t varchar(50) null,
  zip_code_t varchar(10) null,
  notes_t text null,
  aud_insert_dt date default current_date not null,
  aud_insert_ts datetime(6) default current_timestamp not null,
  aud_update_ts datetime(6) null
);