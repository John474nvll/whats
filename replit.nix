nix
let
  pkgs = import <nixpkgs> {};
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    openssl
    nodejs-18_x
    python3
  ] ++ (with pkgs.python3Packages; [
    requests
    pycryptodome
    curl_cffi
    aiohttp
    certifi
    browser_cookie3
    nest_asyncio
    werkzeug
    pillow
    platformdirs
    fastapi
    uvicorn
    flask
    brotli
    beautifulsoup4
    setuptools
    python-multipart
    a2wsgi
    python-dotenv
    ddgs
    cloudscraper
  ]);

  # Set environment variables for curl_cffi and other potential needs
  shellHook = ''
    export PYTHONNOUSERSITE=1
  '';
}