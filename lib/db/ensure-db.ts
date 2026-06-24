import { NextRequest } from 'next/server';
import { getDb, getDbFromRequest, getDbFromCloudflareContextAsync, setDb } from '@/lib/db/cloudflare';
import { getLocalD1, initLocalDbPasswords } from '@/lib/db/local-d1';

let localInitialized = false;

export async function ensureDb(request?: NextRequest): Promise<void> {
  if (request) {
    const db = getDbFromRequest(request);
    if (db) {
      setDb(db);
      return;
    }

    const asyncDb = await getDbFromCloudflareContextAsync();
    if (asyncDb) {
      setDb(asyncDb);
      return;
    }
  }

  const db = getDb();
  setDb(db);

  if (db === getLocalD1() && !localInitialized) {
    await initLocalDbPasswords();
    localInitialized = true;
  }
}
