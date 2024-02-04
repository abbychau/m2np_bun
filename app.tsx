import { Hono } from "hono";
import feeds from "./routes/posts";
import entrance from "./routes/entrance";
import { logger } from "hono/logger";
import Top from "./pages/forgetPassword";
import { db } from "./db";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
const app = new Hono();

declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
  }
}

app.use('*', logger());
app.use('/feeds',
  //auth middleware
  async (c, next) => {
    //can pass token value from header, get, post
    const token = c.req.header('token') || c.req.query('token');
    if (!token) {
      return c.json({ message: "no token" });
    }

    const user = await db.Ar('select * from sessions where session_key = ?', [token]);
    if (!user) {
      return c.json({ message: "invalid token" });
    }

    //@ts-ignore
    c.set('username', user);

    await next();
});
app.use('*', async (c, next) => {
  //if options , return all cors headers
  c.res.headers.set('Access-Control-Allow-Origin', '*');
  if (c.req.method === 'OPTIONS') {
    
    c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    c.res.headers.set('Access-Control-Allow-Headers', '*');
    return c.text('');
  }
  await next();  
});


app.route("/entrance", entrance);
app.route("/feeds", feeds);

app.post("/compose", zValidator(
  'json',
  z.object({
    title: z.string().min(1).max(100),
    body: z.string().optional(),
  })
),
  (c) => {
    return c.json({
      message: "ok",
      data: {
        postId: 1,
      }
    });
  });

app.get("/top", (c) => {
  return c.html(<Top messages={["test1", "test2"]} />);
});

export default app;