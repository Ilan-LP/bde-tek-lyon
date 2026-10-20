import { randomBytes } from 'node:crypto';
import argon2 from 'argon2';

// argon2id with the library defaults (the recommended, memory-hard variant).
export function hashPassword(password: string) {
  return argon2.hash(password);
}

export function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

// Hash of a random password nobody knows. Login verifies against it when the email does not
// exist, so that "unknown email" and "wrong password" take the same time to answer.
let dummyHash: Promise<string> | undefined;
export function getDummyHash() {
  dummyHash ??= hashPassword(randomBytes(32).toString('hex'));
  return dummyHash;
}
