#!/bin/bash
set -e
PG_CTL=/nix/store/j6y1jsy8f16ps655vf1i1z788mv11q83-postgresql-16.3/bin/pg_ctl
INITDB=/nix/store/j6y1jsy8f16ps655vf1i1z788mv11q83-postgresql-16.3/bin/initdb
PGDATA=/home/user/whats/pgdata
LOGFILE=/home/user/whats/logfile
if [ ! -d "$PGDATA" ]; then
  echo "Initializing database..."
  $INITDB -D "$PGDATA"
fi
echo "Starting PostgreSQL and waiting for it to be ready..."
$PG_CTL -D "$PGDATA" -l "$LOGFILE" -w start
