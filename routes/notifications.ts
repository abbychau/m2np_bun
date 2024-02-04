import { Hono } from "hono";
import { redisClient } from "../db";

const notifications = new Hono();

notifications.get("/myNotifications", async c => {
    const userId = c.get("userId");
    const notifications = await redisClient.lRange(`notifications:${userId}`, 0, -1);
    return c.json({notifications});
});