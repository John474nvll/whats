{ pkgs }: {
    deps = [
      pkgs.nodejs_20,
      pkgs.postgresql,
      pkgs.pkg-config
    ];
    env = {
      PRISMA_CLI_QUERY_ENGINE_TYPE = "binary";
    };
}