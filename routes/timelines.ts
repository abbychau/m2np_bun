import { Hono } from "hono";
import { redisClient, db } from "../db";

const timelines = new Hono();

timelines.get("/getMyTimeline", async c => {
    const userId = c.get("userId");
    const timeline = await redisClient.lRange(`timeline:${userId}`, 0, -1);
    
    // get posts from db
    let postsIDs = timeline.join(",");
    let sql = `SELECT * FROM posts WHERE id IN (${postsIDs})`;

    const body = await c.req.json();
    const searchTerm = body.searchTerm;

    // search Term cannot be too long or too short
    if (searchTerm.length < 3 || searchTerm.length > 20) {
        c.status(400);
        return c.json({error: "Search term must be between 3 and 20 characters long"}, 400);
    }

    //use boolean match
    if (searchTerm) {
        sql += ` AND MATCH (content) AGAINST ('${searchTerm}' IN BOOLEAN MODE)`;
    }

    const posts = await db.Ar(sql);
    return c.json({data:posts});

})

timelines.get("/getCreationTimeline/:userId", async c => {
    const userId = c.req.param("userId");
    const timeline = await redisClient.lRange(`creationTimeline:${userId}`, 0, -1);
    return c.json({data:timeline});
})

// get updated posts
timelines.get("/getUpdatedPosts", async c => {
    const userId = c.get("userId");
    // get from redis updatedPosts:
    let updatedPosts = await redisClient.sMembers(`updatedPosts:${userId}`);
    return c.json({data:updatedPosts});
});

// clear updated posts
timelines.post("/clearUpdatedPosts", async c => {
    const userId = c.get("userId");
    await redisClient.del(`updatedPosts:${userId}`);
    return c.json({success: true});
});

// mark one updated post as read
timelines.post("/markUpdatedPostAsRead", async c => {
    const userId = c.get("userId");
    const body = await c.req.json();
    const postId = body.postId;
    await redisClient.sRem(`updatedPosts:${userId}`, postId);
    return c.json({success: true});
});

export default timelines;