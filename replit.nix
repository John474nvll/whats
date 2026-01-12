{ pkgs }: {
    deps = [
      pkgs.nodejs_20,
      pkgs.postgresql,
      pkgs.pkg-config,
      pkgs.openssl
    ];
    env = {
      PRISMA_CLI_QUERY_ENGINE_TYPE = "binary";
    };
}