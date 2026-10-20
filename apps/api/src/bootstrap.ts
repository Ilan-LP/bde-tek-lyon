import { prisma } from './db.js';
import { env } from './env.js';
import { hashPassword } from './lib/password.js';

// Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD, only if the Admin table is empty.
// Never logs the password.
export async function ensureFirstAdmin() {
  const count = await prisma.admin.count();

  if (count > 0) {
    console.log(`[bootstrap] ${count} admin(s) already exist: nothing to do.`);
    return;
  }

  await prisma.admin.create({
    data: { email: env.ADMIN_EMAIL, passwordHash: await hashPassword(env.ADMIN_PASSWORD) },
  });
  console.log(`[bootstrap] Admin table was empty: created first admin ${env.ADMIN_EMAIL}.`);
}
