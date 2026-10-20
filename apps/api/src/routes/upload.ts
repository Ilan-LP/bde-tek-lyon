import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Router } from 'express';
import multer from 'multer';
import { env } from '../env.js';
import { detectImageType } from '../lib/imageType.js';

// Mounted behind requireAuth in app.ts: only a logged-in admin can upload.
export const uploadRouter = Router();

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

// The file is kept in memory (at most 2 MB) so we can inspect its real content before saving it.
// multer rejects bigger files while they stream in (MulterError LIMIT_FILE_SIZE -> 400).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES, files: 1 },
});

// Expects multipart/form-data with the image in the field "image".
uploadRouter.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'file_missing' });
    return;
  }

  // We trust neither the filename nor the Content-Type sent by the client, only the bytes.
  const type = detectImageType(req.file.buffer);
  if (!type) {
    res.status(400).json({ error: 'unsupported_file_type' });
    return;
  }

  // The stored name is random and its extension comes from the detected type, never from the client.
  const filename = `${randomUUID()}.${type.ext}`;
  await writeFile(path.join(env.UPLOAD_DIR, filename), req.file.buffer, { flag: 'wx' });

  res.status(201).json({ url: `${env.PUBLIC_API_URL}/uploads/${filename}` });
});
