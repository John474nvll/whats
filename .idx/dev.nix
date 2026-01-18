# This file defines the development environment for your project.
# It's used by your IDE to install the necessary packages.
{ pkgs }: {
    packages = [
        # Node.js and npm
        pkgs.nodejs-20_x
        pkgs.nodePackages.npm,

        # SQLite database
        pkgs.sqlite,

        # Tools for running scripts from package.json
        pkgs.nodePackages.tsx,
        pkgs.drizzle-kit
    ];
}
