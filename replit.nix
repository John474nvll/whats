nix
{
  pkgs ? import <nixpkgs> {}
}:

pkgs.mkShell {
  buildInputs = with pkgs; [
    openssl
    nodejs-18_x
    python3
    python3Packages.pip
  ];
}