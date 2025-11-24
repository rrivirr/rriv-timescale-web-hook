--- create table for heartbeats signal
CREATE TABLE events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    data TEXT NOT NULL,
    eui TEXT NOT NULL,
    time TIMESTAMPTZ NOT NULL
);

SELECT create_hypertable('events', by_range('time'));
