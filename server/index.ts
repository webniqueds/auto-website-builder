import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env BEFORE importing the API handlers: their module body reads
// process.env (Razorpay keys, admin emails, Mongo URI, etc). With static ESM
// imports those handlers would evaluate first and capture empty values.
// override: true makes .env authoritative so a stale/old RAZORPAY key left in
// the parent shell cannot shadow the correct key (Razorpay would otherwise
// reject orders with 401 "Authentication failed").
dotenv.config({ path: resolve(__dirname, '..', '.env'), override: true });

const { createApp } = await import('./app.js');

const app = createApp();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});