import { Elysia } from "elysia";
import { health } from "./health";
import { images } from "./images";

export const api = new Elysia({ prefix: "api" }).use(health).use(images);
