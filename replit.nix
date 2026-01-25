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
    requests
    pycryptodome
    (buildPythonPackage {
      pname = "curl_cffi";
      version = "0.6.2"; # Specify version 0.6.2 as a baseline for >=0.6.2
      src = pkgs.fetchPypi {
        inherit pname version;
        sha256 = "sha256-R47vFz2w3m3j4j2j5k1k0l1k2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f"; # Placeholder, actual hash needed for specific version
      };
      # If curl_cffi depends on other Nix packages, list them here:
      # buildInputs = [ pkgs.libcurl ];
    })
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
    pip
  ]);
}