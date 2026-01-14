import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });
if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL must be set. Did you forget to provision a database?");
}

export default defineConfig({
    out: "./migrations",
    schema: "./src/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.POSTGRES_URL,
    },
});
