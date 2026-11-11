import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '.pglite-data');

console.log(`Starting embedded PostgreSQL on port 5432 with data dir: ${dataDir}`);
const db = await PGlite.create({ dataDir });
const server = new PGLiteSocketServer({
  db,
  port: 5432,
  host: '127.0.0.1',
});

await server.start();
console.log('Embedded PostgreSQL is ready and listening on 127.0.0.1:5432');

process.on('SIGINT', async () => {
  console.log('Stopping server...');
  await server.stop();
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await server.stop();
  await db.close();
  process.exit(0);
});
