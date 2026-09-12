import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const imagesTable = sqliteTable("images_table", {
    id: int().primaryKey({ autoIncrement: true }),
    filename: text().notNull(),
    createdAt: int({ mode: "timestamp_ms" }).notNull(),
    lastModifiedAt: int({ mode: "timestamp_ms" }).notNull(),
});
