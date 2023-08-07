import { Hono } from "hono";

const app = new Hono();
app.get("/", (c) => c.text("Welcome to the Noot API!"));
export default app;
