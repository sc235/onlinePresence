import {CabinetAvocatBackendApplication} from './application';
import {AdminRepository} from './repositories';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname, '../.env')});

export async function migrateSchema(args: string[]) {
  const schemaOption = args.includes('--rebuild') ? 'rebuild' : 'update';
  console.log(`Migrating schemas (%s)...`, schemaOption);

  const app = new CabinetAvocatBackendApplication();
  await app.boot();

  const ds = await app.get<any>('datasources.db');

  if (schemaOption === 'rebuild') {
    // Run schema migration by dropping and recreating tables
    await app.migrateSchema({existingSchema: 'drop'});
  } else {
    // Update existing schemas
    await app.migrateSchema();
  }

  // Seed default admin account if table is empty
  const adminRepo = await app.getRepository(AdminRepository);
  const adminCount = await adminRepo.count();

  if (adminCount.count === 0) {
    const defaultUsername = process.env.ADMIN_USERNAME ?? 'admin';
    const defaultPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(defaultPassword, salt);

    await adminRepo.create({
      username: defaultUsername,
      passwordHash: hash,
    });
    console.log(`👤 Compte administrateur "${defaultUsername}" créé avec succès dans PostgreSQL.`);
  }

  // Connectors usually keep a pool of connections open,
  // disconnect them otherwise the process will hang.
  await ds.disconnect();
  console.log('Schema migration completed.');
}

migrateSchema(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
