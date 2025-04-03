import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import fs from 'fs';

// Use environment variables with fallback for development
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

// Create a new connection instance
const client = postgres(connectionString, {
  max: 1,
  ssl: {
    ca: fs.readFileSync(process.env.SSL_CA_PATH || '', 'utf8').toString(),
  }  
});

export const db = drizzle(client, { schema });

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Helper function to initialize database
export async function initializeDatabase() {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Could not connect to database');
    }
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}