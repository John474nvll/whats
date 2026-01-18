{ pkgs }: {
    packages = [
        pkgs.nodejs-22_x
        pkgs.nodePackages.npm
        pkgs.sqlite
        pkgs.nodePackages.tsx
        pkgs.drizzle-kit
    ];
}
