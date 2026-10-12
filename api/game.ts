import { neon } from '@neondatabase/serverless';
import { createGameHandler } from '../lib/game-service.mjs';

let sqlPromise: Promise<ReturnType<typeof neon>> | undefined;
async function sqlClient() {
  if (!sqlPromise) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) throw new Error('Add a Neon Postgres database from the Vercel Marketplace and expose DATABASE_URL.');
    const sql = neon(url);
    sqlPromise = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS scribble_relay_rooms (room_code text PRIMARY KEY, room jsonb NOT NULL, revision bigint NOT NULL DEFAULT 1)`;
      return sql;
    })();
  }
  return sqlPromise;
}

const getStore = () => ({
  async getWithMetadata(key: string) {
    const sql = await sqlClient();
    const rows = await sql`SELECT room, revision FROM scribble_relay_rooms WHERE room_code = ${key}`;
    if (!rows.length) return null;
    return { data: rows[0].room, etag: String(rows[0].revision) };
  },
  async setJSON(key: string, value: unknown, options: { onlyIfNew?: boolean; onlyIfMatch?: string }) {
    const sql = await sqlClient();
    const payload = JSON.stringify(value);
    if (options.onlyIfNew) {
      const rows = await sql`INSERT INTO scribble_relay_rooms (room_code, room) VALUES (${key}, ${payload}::jsonb) ON CONFLICT (room_code) DO NOTHING RETURNING revision`;
      return { modified: rows.length > 0 };
    }
    const rows = await sql`UPDATE scribble_relay_rooms SET room = ${payload}::jsonb, revision = revision + 1 WHERE room_code = ${key} AND revision = ${Number(options.onlyIfMatch)} RETURNING revision`;
    return { modified: rows.length > 0 };
  }
});

const game = createGameHandler({ getStore });
export default {
  fetch(request: Request) {
    return game(request);
  }
};
