import { Elysia } from "elysia";
import { api } from "./api";
import { pages } from "./pages";
import { dbFilename } from "./db";

// for easier debugging
// the import also valiates the db
console.log("🦊 DATABASE:", dbFilename);

if (!process.env.VERSION) {
    process.env.VERSION = await Bun.$`git rev-parse --short HEAD`.text();
}

// for invalidating static file cache
console.log("🦊 VERSION:", process.env.VERSION);

const app = new Elysia()
    .use(api)
    .use(pages)
    .listen(process.env.PORT ?? 3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
