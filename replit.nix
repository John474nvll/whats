nix
{
  pkgs ? import <nixpkgs> {}
}:

pkgs.mkShell {
  buildInputs = with pkgs; [
    openssl
    nodejs-18_x
    python3
  ] ++ (with pkgs.python3Packages; [
    # List your Python packages here, e.g.,
    # requests
    # numpy
    pip
  ]);
}