                  urlPattern: ({ url }) => url.pathname.startsWith("/api"),
                  handler: "NetworkFirst",
                  options: {
                    cacheName: "api-cache",
                    expiration: {
                      maxEntries: 10,
                      maxAgeSeconds: 60 * 60 * 24, // 1 day
                    },
                    cacheableResponse: {
                      statuses: [0, 200],
                    },
                  },
                },
              ],
            },
          }),
        ],
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./src"),
          },
        },
      });