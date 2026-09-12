import { Elysia } from "elysia";
import { health } from "./health";

export const api = new Elysia({ prefix: "api" }).use(health);
