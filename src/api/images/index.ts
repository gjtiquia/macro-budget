import { Elysia } from "elysia";
import { db, imagesTable } from "../../db";

export const images = new Elysia({ prefix: "images" })
    .get("/", async () => {
        const images = await db
            .select({
                filename: imagesTable.filename,
                lastModifiedAt: imagesTable.lastModifiedAt,
            })
            .from(imagesTable);

        return images;
    })
    .get("/health", () => "hello world");
