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

DELETE FROM exam_records.student_exam;
DELETE FROM exam_records.subject_staff;
DELETE FROM exam_records.student_subject;
DELETE FROM exam_records.exam_room_reservation;
DELETE FROM exam_records.exam;

DELETE FROM exam_records.users WHERE email != 'admin@examrecords.com';

DELETE FROM exam_records.student_program WHERE name != 'ADMIN_PROGRAM';

INSERT INTO exam_records.student_program(name, year)
SELECT 'KNI', 2018
WHERE NOT EXISTS (SELECT 1 FROM exam_records.student_program WHERE name = 'KNI');

INSERT INTO exam_records.student_program(name, year)
SELECT 'IKI', 2018
WHERE NOT EXISTS (SELECT 1 FROM exam_records.student_program WHERE name = 'IKI');

INSERT INTO exam_records.student_program(name, year)
SELECT 'PET', 2018
WHERE NOT EXISTS (SELECT 1 FROM exam_records.student_program WHERE name = 'PET');

INSERT INTO exam_records.student_program(name, year)
SELECT 'ADMIN_PROGRAM', 0
WHERE NOT EXISTS (SELECT 1 FROM exam_records.student_program WHERE name = 'ADMIN_PROGRAM');

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

alter table exam_records.exam_room_reservation drop column capacity;

DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_schema = 'exam_records'
                         AND table_name = 'student_exam'
                         AND column_name = 'grade') THEN
            ALTER TABLE exam_records.student_exam ADD COLUMN grade DECIMAL(4,2);
        END IF;
    END $$;

DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_schema = 'exam_records'
                         AND table_name = 'student_exam'
                         AND column_name = 'graded_by') THEN
            ALTER TABLE exam_records.student_exam ADD COLUMN graded_by INT;
            ALTER TABLE exam_records.student_exam ADD CONSTRAINT fk_student_exam_graded_by
                FOREIGN KEY (graded_by) REFERENCES exam_records.users(id);
        END IF;
    END $$;

DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_schema = 'exam_records'
                         AND table_name = 'student_exam'
                         AND column_name = 'graded_at') THEN
            ALTER TABLE exam_records.student_exam ADD COLUMN graded_at TIMESTAMP;
        END IF;
    END $$;

DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                       WHERE constraint_schema = 'exam_records'
                         AND table_name = 'student_exam'
                         AND constraint_name = 'check_grade_range') THEN
            ALTER TABLE exam_records.student_exam
                ADD CONSTRAINT check_grade_range
                    CHECK (grade IS NULL OR (grade >= 0 AND grade <= 100));
        END IF;
    END $$;

DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes
                       WHERE schemaname = 'exam_records'
                         AND tablename = 'student_exam'
                         AND indexname = 'idx_student_exam_graded_by') THEN
            CREATE INDEX idx_student_exam_graded_by ON exam_records.student_exam(graded_by);
        END IF;
    END $$;

DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes
                       WHERE schemaname = 'exam_records'
                         AND tablename = 'student_exam'
                         AND indexname = 'idx_student_exam_exam_grade') THEN
            CREATE INDEX idx_student_exam_exam_grade ON exam_records.student_exam(exam_id, grade);
        END IF;
    END $$;

DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes
                       WHERE schemaname = 'exam_records'
                         AND tablename = 'student_exam'
                         AND indexname = 'idx_student_exam_exam_graded_by') THEN
            CREATE INDEX idx_student_exam_exam_graded_by ON exam_records.student_exam(exam_id, graded_by);
        END IF;
    END $$;


COMMIT;