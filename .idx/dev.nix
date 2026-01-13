
# This file defines the development environment for your project.
# It's used by your IDE to install the necessary packages.
{ pkgs }: {
    deps = [
        # Node.js and npm
        pkgs.nodejs-20_x
        pkgs.nodePackages.npm

        # PostgreSQL database
        pkgs.postgresql

        # Tools for running scripts from package.json
        pkgs.nodePackages.tsx
        pkgs.drizzle-kit
    ];
}
