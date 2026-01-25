set -e

# Initialize PostgreSQL data directory
if [ ! -d "/tmp/postgres" ]; then
  initdb -D /tmp/postgres
fi

# Start PostgreSQL server
pg_ctl -D /tmp/postgres -l /tmp/postgres/logfile start

# Create a user and database (if they don't exist)
if ! psql -lqt | cut -d \| -f 1 | grep -qw socialhub; then
  createuser -s postgres
  createdb socialhub
fi
