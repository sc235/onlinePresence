import {ApplicationConfig, CabinetAvocatBackendApplication} from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new CabinetAvocatBackendApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`\n⚖️  Serveur Cabinet d'Avocat (LoopBack 4)`);
  console.log(`   → API: ${url}`);
  console.log(`   → Health: ${url}/health\n`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 5000),
      host: process.env.HOST ?? 'localhost',
      // The `gracePeriodForClose` option controls how long to wait for
      // active connections to complete before shutting down the HTTP server.
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to resolve properties
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
