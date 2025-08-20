create schema if not exists exam_records;

create table if not exists exam_records.subject
(
    code        int primary key,
    name        varchar(255) not null,
    semester    varchar(255) not null,
    year        int          not null
);

create table if not exists exam_records.userrole
(
    id bigserial primary key,
    role varchar(255) not null unique
);

insert into exam_records.userrole(role)
values ('ROLE_STUDENT'),
       ('ROLE_TEACHER'),
       ('ROLE_ADMIN')
on conflict (role) do nothing;

create table if not exists exam_records.users
(
    id              bigserial primary key,
    name            varchar(255) not null,
    surname         varchar(255) not null,
    email           varchar(255) not null unique,
    password        varchar(255) not null,
    role_id         bigint          not null,
    student_index   int,
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
       ('september')
on conflict (name) do nothing;

create table if not exists exam_records.exam
(
    id           bigserial primary key,
    subject_code bigint not null,
    session_id   bigint not null,
    date         date not null,
    start_time   time not null,
    end_time     time not null,
    foreign key (subject_code) references exam_records.subject (code) on delete cascade,
    foreign key (session_id) references exam_records.session (id) on delete cascade
);

create table if not exists exam_records.subject_staff
(
    subject_code bigint not null,
    user_id bigint not null,
    primary key (subject_code, user_id),
    foreign key (subject_code) references exam_records.subject (code) on delete cascade,
    foreign key (user_id) references exam_records.users (id) on delete cascade
);

create table if not exists exam_records.room
(
    id       bigserial primary key,
    name     varchar(255) not null unique,
    capacity int          not null
);

create table if not exists exam_records.exam_room_reservation
(
    exam_id bigint not null,
    room_id bigint not null,
    primary key (exam_id, room_id),
    foreign key (exam_id) references exam_records.exam (id) on delete cascade,
    foreign key (room_id) references exam_records.room (id) on delete cascade
);

create table if not exists exam_records.student_exam
(
    id bigserial primary key,
    student_id bigint not null,
    exam_id bigint not null,
    showed boolean default false,
    constraint fk_student foreign key (student_id) references exam_records.users (id) on delete cascade,
    constraint fk_exam foreign key (exam_id) references exam_records.exam (id) on delete cascade,
    constraint uq_student_exam unique (student_id, exam_id)
);

create table if not exists exam_records.student_subject
(
    student_id bigint not null,
    subject_code bigint not null,
    primary key (student_id, subject_code),
    foreign key (student_id) references exam_records.users (id) on delete cascade,
    foreign key (subject_code) references exam_records.subject (code) on delete cascade
);