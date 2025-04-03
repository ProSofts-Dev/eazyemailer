import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
    // ssl: {
    //   rejectUnauthorized: true,
    //   ca: fs.readFileSync('/etc/letsencrypt/live/app.eazyemailer.com/fullchain.pem', 'utf8')
    // }
  },
  verbose: true,
  strict: true,
} satisfies Config;