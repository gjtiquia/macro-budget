import "dotenv/config";
import { fileURLToPath } from "node:url";
import { push } from "drizzle-kit/cli";
import { drizzle } from "drizzle-orm/bun-sqlite";

export const dbFilename = process.env.DB_FILE_NAME;
if (!dbFilename) {
    throw new Error("DB_FILE_NAME must be set.");
}

const dbExists = await Bun.file(dbFilename).exists();
if (!dbExists) {
    throw new Error(`${dbFilename} does not exist! hint: bun run db:push`);
}

const dbValidateOutput = await Bun.$`bun run db:validate`.text();
if (!dbValidateOutput.includes("No changes detected")) {
    throw new Error("db schema is out of sync! hint: bun run db:push");
}

export const db = drizzle(dbFilename);
db.$client.exec("PRAGMA foreign_keys = ON");

export * from "./schema";
