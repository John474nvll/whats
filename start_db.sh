#!/bin/bash
set -e
PG_CTL=/nix/store/qsmz8pss6j0s2hj65bj5wgx5yrv2qfkz-postgresql-16.9/bin/pg_ctl
INITDB=/nix/store/qsmz8pss6j0s2hj65bj5wgx5yrv2qfkz-postgresql-16.9/bin/initdb
PGDATA=/home/user/whats/pgdata
LOGFILE=/home/user/whats/logfile
if [ ! -d "$PGDATA" ]; then
  echo "Initializing database..."
  $INITDB -D "$PGDATA"
fi
echo "Starting PostgreSQL and waiting for it to be ready..."
$PG_CTL -D "$PGDATA" -l "$LOGFILE" -w start
