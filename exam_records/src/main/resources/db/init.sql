create schema if not exists exam_records;

create table if not exists exam_records.userrole
(
    id   serial primary key,
    role varchar(255) not null unique
);

create table if not exists exam_records.student_program
(
    id   serial primary key,
    name varchar(255) not null unique,
    year int not null
);

create table if not exists exam_records.users
(
    id                 serial primary key,
    email              varchar(255) not null unique,
    index              varchar(255),
    name               varchar(255) not null,
    password           varchar(255) not null,
    surname            varchar(255) not null,
    role_id            int          not null references exam_records.userrole (id),
    student_program_id int          not null references exam_records.student_program (id),
    enabled            boolean default false,
    reset_token        varchar(255),
    reset_token_expiry timestamp,
    unique (email)
);

create table if not exists exam_records.session
(
    id   serial primary key,
    name varchar(255) not null unique
);

create table if not exists exam_records.subject
(
    code     bigint primary key,
    name     varchar(255) not null,
    year     int,
    semester varchar(50)
);

create table if not exists exam_records.exam
(
    id           serial primary key,
    subject_code bigint not null references exam_records.subject (code),
    session_id   int not null references exam_records.session (id),
    date         date not null,
    start_time   time not null,
    end_time     time not null
);

create table if not exists exam_records.subject_staff
(
    id           serial primary key,
    subject_code bigint not null references exam_records.subject (code),
    user_id      int not null references exam_records.users (id)
);

create table if not exists exam_records.room
(
    id   serial primary key,
    name varchar(255) not null
);

create table if not exists exam_records.exam_room_reservation
(
    id       serial primary key,
    exam_id  int not null references exam_records.exam (id),
    room_id  int not null references exam_records.room (id),
    capacity int not null
);

create table if not exists exam_records.student_exam
(
    id       serial primary key,
    exam_id  int not null references exam_records.exam (id),
    user_id  int not null references exam_records.users (id)
);

create table if not exists exam_records.student_subject
(
    id           serial primary key,
    subject_code bigint not null references exam_records.subject (code),
    student_id   int not null references exam_records.users (id)
);

insert into exam_records.userrole(role)
select 'ROLE_STUDENT'
where not exists (select 1 from exam_records.userrole where role = 'ROLE_STUDENT');

insert into exam_records.userrole(role)
select 'ROLE_TEACHER'
where not exists (select 1 from exam_records.userrole where role = 'ROLE_TEACHER');

insert into exam_records.userrole(role)
select 'ROLE_ADMIN'
where not exists (select 1 from exam_records.userrole where role = 'ROLE_ADMIN');

insert into exam_records.session(name)
select 'first_midterm'
where not exists (select 1 from exam_records.session where name = 'first_midterm');

insert into exam_records.session(name)
select 'second_midterm'
where not exists (select 1 from exam_records.session where name = 'second_midterm');

insert into exam_records.session(name)
select 'january'
where not exists (select 1 from exam_records.session where name = 'january');

insert into exam_records.session(name)
select 'june'
where not exists (select 1 from exam_records.session where name = 'june');

insert into exam_records.session(name)
select 'september'
where not exists (select 1 from exam_records.session where name = 'september');

-- Clear existing student programs to avoid conflicts
DELETE FROM exam_records.student_program;

-- Reset the sequence
ALTER SEQUENCE exam_records.student_program_id_seq RESTART WITH 1;

-- Insert new data
insert into exam_records.student_program(name, year) values ('KNI', 2018);
insert into exam_records.student_program(name, year) values ('IKI', 2018);
insert into exam_records.student_program(name, year) values ('PET', 2018);
insert into exam_records.student_program(name, year) values ('ADMIN_PROGRAM', 0);

DO $$
DECLARE
    admin_role_id INT;
    admin_program_id INT;
BEGIN
    SELECT id INTO admin_role_id FROM exam_records.userrole WHERE role = 'ROLE_ADMIN';
    SELECT id INTO admin_program_id FROM exam_records.student_program WHERE name = 'ADMIN_PROGRAM';
    
    INSERT INTO exam_records.users(email, index, name, password, surname, role_id, student_program_id, enabled)
    VALUES ('admin@examrecords.com', null, 'Admin',
            '$2a$10$UD1kOJqVWg0HBxDuUuPd1udW6Tu59oZBusI2idtnilj9E6dDwgFOW',
            'User', admin_role_id, admin_program_id, true);
EXCEPTION WHEN unique_violation THEN
    UPDATE exam_records.users SET 
        password = '$2a$10$UD1kOJqVWg0HBxDuUuPd1udW6Tu59oZBusI2idtnilj9E6dDwgFOW',
        enabled = true
    WHERE email = 'admin@examrecords.com';
END $$;

alter table exam_records.student_exam drop column student_id;