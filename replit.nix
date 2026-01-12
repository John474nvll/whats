{ pkgs }: {
    deps = [
      pkgs.nodejs_20,
      pkgs.postgresql,
      pkgs.pkg-config,
      pkgs.openssl_1_1
    ];
    env = {
      PRISMA_CLI_QUERY_ENGINE_TYPE = "binary";
      PRISMA_CLI_BINARY_TARGETS = "native";
      LD_LIBRARY_PATH = "${pkgs.openssl_1_1}/lib";
    };
}