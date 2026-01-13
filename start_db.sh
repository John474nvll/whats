#!/bin/bash
# Initialize the database if it hasn't been already
if [ ! -d "pgdata" ]; then
  initdb pgdata
fi

# Start the PostgreSQL server
pg_ctl -D pgdata -l logfile start
