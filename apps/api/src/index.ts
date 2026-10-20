import { createApp } from './app.js';
import { ensureFirstAdmin } from './bootstrap.js';
import { env } from './env.js';

await ensureFirstAdmin();

createApp().listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});
