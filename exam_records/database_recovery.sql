
-- 1) Ensure the application DB user exists with comprehensive privileges
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'admin') THEN
        CREATE ROLE admin LOGIN PASSWORD 'admin' CREATEDB CREATEROLE;
    ELSE
        ALTER ROLE admin WITH LOGIN PASSWORD 'admin' CREATEDB CREATEROLE;
    END IF;
END $$;

-- Grant database-level privileges
GRANT ALL PRIVILEGES ON DATABASE exam_records TO admin;
GRANT CONNECT, TEMP, CREATE ON DATABASE exam_records TO admin;

-- 2) Ensure schema exists and is owned by admin with full privileges
CREATE SCHEMA IF NOT EXISTS exam_records;
ALTER SCHEMA exam_records OWNER TO admin;
GRANT ALL PRIVILEGES ON SCHEMA exam_records TO admin;
GRANT USAGE, CREATE ON SCHEMA exam_records TO admin;

-- 3) Reassign ownership of ALL existing objects in the schema to admin
DO $$
DECLARE r record;
BEGIN
    -- Tables
    FOR r IN
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname = 'exam_records'
    LOOP
        EXECUTE format('ALTER TABLE %I.%I OWNER TO admin', r.schemaname, r.tablename);
    END LOOP;

    -- Sequences
    FOR r IN
        SELECT sequence_schema AS schemaname, sequence_name AS objname
        FROM information_schema.sequences
        WHERE sequence_schema = 'exam_records'
    LOOP
        EXECUTE format('ALTER SEQUENCE %I.%I OWNER TO admin', r.schemaname, r.objname);
    END LOOP;

    -- Views
    FOR r IN
        SELECT table_schema AS schemaname, table_name AS objname
        FROM information_schema.views
        WHERE table_schema = 'exam_records'
    LOOP
        EXECUTE format('ALTER VIEW %I.%I OWNER TO admin', r.schemaname, r.objname);
    END LOOP;
END $$;

-- 4) Grant comprehensive privileges on all existing objects
GRANT ALL PRIVILEGES ON ALL TABLES     IN SCHEMA exam_records TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES  IN SCHEMA exam_records TO admin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS  IN SCHEMA exam_records TO admin;
GRANT ALL PRIVILEGES ON ALL PROCEDURES IN SCHEMA exam_records TO admin;

-- 5) Ensure future objects auto-grant to admin
ALTER DEFAULT PRIVILEGES IN SCHEMA exam_records GRANT ALL ON TABLES     TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA exam_records GRANT ALL ON SEQUENCES  TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA exam_records GRANT ALL ON FUNCTIONS  TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA exam_records GRANT ALL ON PROCEDURES TO admin;

-- 6) Additional admin privileges for database management
GRANT USAGE ON SCHEMA public TO admin;
GRANT CREATE ON SCHEMA public TO admin;

-- Make admin a member of standard PostgreSQL admin roles for maximum privileges
DO $$
BEGIN
    -- Grant role membership for comprehensive database management
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pg_read_all_data') THEN
        GRANT pg_read_all_data TO admin;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pg_write_all_data') THEN
        GRANT pg_write_all_data TO admin;
    END IF;
    
    -- Note: pg_database_owner cannot have explicit members, so we grant equivalent privileges instead
END $$;

-- Grant equivalent privileges to pg_database_owner
DO $$
BEGIN
    -- Make admin the owner of the database (equivalent to pg_database_owner membership)
    IF EXISTS (SELECT 1 FROM pg_database WHERE datname = 'exam_records') THEN
        ALTER DATABASE exam_records OWNER TO admin;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- If we can't make admin the database owner, grant maximum possible privileges
    RAISE NOTICE 'Could not set admin as database owner, but admin has comprehensive privileges';
END $$;

-- 7) Fix column type mismatch for users.index (string -> bigint) if needed
-- Safely convert any non-numeric values to NULL, then cast to bigint
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'exam_records'
          AND table_name   = 'users'
          AND column_name  = 'index'
          AND data_type    <> 'bigint'
    ) THEN
        EXECUTE 'ALTER TABLE exam_records.users 
                 ALTER COLUMN "index" TYPE bigint 
                 USING NULLIF(regexp_replace("index"::text, ''[^0-9]'', '''', ''g''), '''')::bigint';
    END IF;
END $$;

-- 8) Ensure admin application user row exists with a known password (admin123)
-- BCrypt hash for "admin123": $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd99jbyronHYHBea
INSERT INTO exam_records.userrole(role)
SELECT 'ROLE_ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM exam_records.userrole WHERE role = 'ROLE_ADMIN');

INSERT INTO exam_records.student_program(name, year)
SELECT 'ADMIN_PROGRAM', 0
WHERE NOT EXISTS (SELECT 1 FROM exam_records.student_program WHERE name = 'ADMIN_PROGRAM');

INSERT INTO exam_records.users(email, name, surname, password, role_id, student_program_id, enabled)
SELECT 'admin@examrecords.com', 'Admin', 'User',
       '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd99jbyronHYHBea',
       r.id, sp.id, true
FROM exam_records.userrole r
JOIN exam_records.student_program sp ON sp.name = 'ADMIN_PROGRAM'
WHERE r.role = 'ROLE_ADMIN'
  AND NOT EXISTS (SELECT 1 FROM exam_records.users WHERE email = 'admin@examrecords.com');

UPDATE exam_records.users
SET password = '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd99jbyronHYHBea',
    enabled  = true
WHERE email = 'admin@examrecords.com';
