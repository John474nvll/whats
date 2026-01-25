nix
with import <nixpkgs> {};

mkShell {
  buildInputs = [
    openssl
    nodejs-18_x
    python3
    python3Packages.pip
  ];
}