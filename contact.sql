--
-- drop table contacts;
-- select * from contacts;
create table if not exists contacts (
  contact_id serial primary key,
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