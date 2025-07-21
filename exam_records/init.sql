create schema if not exists exam_records;

create table if not exists exam_records.semester(
    id serial primary key,
    name varchar(255) not null unique
);

insert into exam_records.semester(name) values ('winter'), ('summer');

create table if not exists exam_records.subject(
    code int primary key,
    name varchar(255) not null,
    semester_id int not null,
    year int not null,
    foreign key (semester_id) references exam_records.semester(id)
);

create table if not exists exam_records.userrole(
    id serial primary key,
    role varchar(255) not null unique
);

insert into exam_records.userrole(role) values ('ROLE_STUDENT'), ('ROLE_ASSISTANT'), ('ROLE_PROFESSOR');

create table if not exists exam_records.users(
    id serial primary key,
    name varchar(255) not null,
    surname varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    role_id int not null,
    index int,
    student_program varchar(255),
    foreign key (role_id) references exam_records.userrole(id)
);

create table if not exists exam_records.session(
    id serial primary key,
    name varchar(255) not null unique
);

insert into exam_records.session(name) values ('first_midterm'), ('second_midterm'), ('january'), ('june'), ('september');

create table if not exists exam_records.exam(
    id serial primary key,
    subject_id int not null,
    session_id int not null,
    date date not null,
    num_students int not null,
    num_rooms int not null,
    start_time time not null,
    end_time time not null,
    foreign key (subject_id) references exam_records.subject(code),
    foreign key (session_id) references exam_records.session(id)
);

create index if not exists idx_subject_semester_year on exam_records.subject (semester_id, year);