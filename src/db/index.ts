import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

// Check if database variables are set, but don't throw - allow app to start
const hasDbConfig = !!(
    process.env.DATABASE_HOST && 
    process.env.DATABASE_USER && 
    process.env.DATABASE_PASSWORD && 
    process.env.DATABASE_NAME
);

if (!hasDbConfig) {
    console.warn('[DB] Database connection variables not fully configured. App will run with limited functionality.');
}

const getPoolConfig = () => {
    const config: any = {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    };

    console.log('[DB] Connecting to:', config.host);

    // Use Supabase certificate if available
    if (process.env.DATABASE_CA) {
        console.log('[DB] Using provided CA certificate');
        config.ssl = {
            ca: process.env.DATABASE_CA,
            rejectUnauthorized: true,
        };
    } else {
        // Try to load certificate from file
        const certPath = path.join(process.cwd(), 'prod-ca-2021.crt');
        if (fs.existsSync(certPath)) {
            console.log('[DB] Loading Supabase certificate from file');
            config.ssl = {
                ca: fs.readFileSync(certPath, 'utf8'),
                rejectUnauthorized: true,
            };
        } else {
            // Fallback: allow self-signed certificates in development
            console.log('[DB] Using self-signed certificate bypass');
            config.ssl = { rejectUnauthorized: false };
        }
    }

    return config;
};

// Only create pool if config is available
export const pool = hasDbConfig ? new Pool(getPoolConfig()) : null;
export const db = pool ? drizzle(pool, { schema }) : null as any;
