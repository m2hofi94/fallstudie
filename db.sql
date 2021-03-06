use afs;

drop table if exists tokens;
drop table if exists answers;
drop table if exists recipients;
drop table if exists questions;
drop table if exists surveys;
drop table if exists users;


create table users (
  id int not null auto_increment primary key,
  email varchar(100) not null unique,
  title varchar(100),
  firstName varchar(100),
  lastName varchar(100),
  password varchar(100) not null,
  created timestamp default now()
);

create table surveys (
  id int not null auto_increment primary key,
  userID int not null,
  status varchar(100) not null,
  title varchar(100),
  countRecipients int default 0,
  countAnswers int default 0,
  endDate timestamp,
  created timestamp default now(),
  FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE
);

create table questions(
  id int not null auto_increment primary key,
  surveyID int not null,
  title varchar(200),
  type varchar(100),
  created timestamp default now(),
  FOREIGN KEY (surveyID) REFERENCES surveys(id) ON DELETE CASCADE
);

create table tokens (
  id int not null auto_increment primary key,
  surveyID int not null,
  token varchar(100) not null,
  keepAfterUse boolean not null default 0, # if survey is open for everyone
  valid boolean not null default 1, # if token may be used / Survey is still available
  used boolean not null default 0 # if token is already used by someone
);

create table recipients (
  email varchar(100) not null,
  surveyID int not null,
  PRIMARY KEY (email, surveyID),
  FOREIGN KEY (surveyID) REFERENCES surveys(id) ON DELETE CASCADE
);

create table answers(
  id int not null auto_increment primary key,
  surveyID int not null,
  questionID int not null,
  value varchar(10000) not null,
  FOREIGN KEY (surveyID) REFERENCES surveys(id) ON DELETE CASCADE,
  FOREIGN KEY (questionID) REFERENCES questions(id) ON DELETE CASCADE
);
