create schema if not exists exam_records;

create table if not exists exam_records.subject
(
    code     int primary key,
    name     varchar(255) not null,
    semester varchar(255) not null,
    year     int          not null
);

create table if not exists exam_records.userrole
(
    id   serial primary key,
    role varchar(255) not null unique
);

insert into exam_records.userrole(role)
values ('ROLE_STUDENT'),
       ('ROLE_TEACHER');

create table if not exists exam_records.users
(
    id              serial primary key,
    name            varchar(255) not null,
    surname         varchar(255) not null,
    email           varchar(255) not null unique,
    password        varchar(255) not null,
    role_id         int          not null,
    index           int,
    student_program varchar(255),
    foreign key (role_id) references exam_records.userrole (id) on delete cascade
);

create table if not exists exam_records.session
(
    id   serial primary key,
    name varchar(255) not null unique
);

insert into exam_records.session(name)
values ('first_midterm'),
       ('second_midterm'),
       ('january'),
       ('june'),
       ('september');

create table if not exists exam_records.exam
(
    id           serial primary key,
    subject_code int  not null,
    session_id   int  not null,
    date         date not null,
    start_time   time not null,
    end_time     time not null,
    foreign key (subject_code) references exam_records.subject (code) on delete cascade,
    foreign key (session_id) references exam_records.session (id) on delete cascade
);

create table if not exists exam_records.subject_staff
(
    subject_id int not null,
    user_id    int not null,
    primary key (subject_id, user_id),
    foreign key (subject_id) references exam_records.subject (code) on delete cascade,
    foreign key (user_id) references exam_records.users (id) on delete cascade
);

create table if not exists exam_records.room
(
    id       serial primary key,
    name     varchar(255) not null unique,
    capacity int          not null
);

create table if not exists exam_records.exam_room_reservation
(
    room_id int not null,
    exam_id int not null,
    primary key (room_id, exam_id),
    foreign key (room_id) references exam_records.room (id) on delete cascade,
    foreign key (exam_id) references exam_records.exam (id) on delete cascade
);

create table if not exists exam_records.student_program
(
    id   serial primary key,
    name varchar(255) not null,
    year int          not null
);

ALTER TABLE IF EXISTS exam_records.users
    ADD COLUMN IF NOT EXISTS student_program_id int;

ALTER TABLE IF EXISTS exam_records.users
    DROP COLUMN IF EXISTS student_program;

DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1
                       FROM information_schema.table_constraints
                       WHERE constraint_schema = 'exam_records'
                         AND table_name = 'users'
                         AND constraint_name = 'fk_student_program') THEN
            ALTER TABLE exam_records.users
                ADD CONSTRAINT fk_student_program
                    FOREIGN KEY (student_program_id)
                        REFERENCES exam_records.student_program (id)
                        ON DELETE CASCADE;
        END IF;
    END
$$;
