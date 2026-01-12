{ pkgs }: {
    deps = [
      pkgs.nodejs_20,
      pkgs.postgresql,
      pkgs.openssl_3,
      pkgs.pkg-config
    ];
    env = {
      LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [ pkgs.openssl_3 ];
      PRISMA_CLI_QUERY_ENGINE_TYPE = "binary";
    };
}