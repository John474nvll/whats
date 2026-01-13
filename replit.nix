
# This file defines the development environment for your project.
# It's used by your IDE to install the necessary packages.
{ pkgs }: {
    deps = [
        # Node.js and npm (using a compatible version)
        pkgs.nodejs-22_x
        pkgs.nodePackages.npm

        # PostgreSQL database
        pkgs.postgresql

        # Tools for running scripts from package.json
        pkgs.nodePackages.tsx
        pkgs.drizzle-kit
    ];
    # This part of the configuration runs when the environment starts.
    # It creates the necessary directory for PostgreSQL to run correctly and starts the service.
    pre-init = ''
      # Create a robust start_db.sh script with absolute paths
      echo "#!/bin/bash" > start_db.sh
      echo "set -e" >> start_db.sh
      echo "PG_CTL=${pkgs.postgresql}/bin/pg_ctl" >> start_db.sh
      echo "INITDB=${pkgs.postgresql}/bin/initdb" >> start_db.sh
      echo 'PGDATA=/home/user/whats/pgdata' >> start_db.sh
      echo 'LOGFILE=/home/user/whats/logfile' >> start_db.sh
      echo 'if [ ! -d "$PGDATA" ]; then' >> start_db.sh
      echo '  echo "Initializing database..."' >> start_db.sh
      echo '  $INITDB -D "$PGDATA"' >> start_db.sh
      echo 'fi' >> start_db.sh
      echo 'echo "Starting PostgreSQL and waiting for it to be ready..."' >> start_db.sh
      # Use -w to wait for the server to start
      echo '$PG_CTL -D "$PGDATA" -l "$LOGFILE" -w start' >> start_db.sh
      chmod +x start_db.sh

      # Ensure the PostgreSQL run directory exists
      mkdir -p /run/postgresql && chown -R $USER:$USER /run/postgresql
      
      # Execute the script to start the database
      # This will now block until the database is ready
      ./start_db.sh
    '';
}
