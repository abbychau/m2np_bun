import { Hono } from "hono";
import { redisClient } from "../db";

const likes = new Hono();

likes.post("/likePost", async c => {
    const body = await c.req.json();
    const userId = body.userId;
    const postId = body.postId;

    await redisClient.sAdd(`likes:${postId}`, userId);

    //add to user's liked posts
    await redisClient.sAdd(`likedPosts:${userId}`, postId);
});

likes.post("/unlikePost", async c => {
    const body = await c.req.json();
    const userId = body.userId;
    const postId = body.postId;

    await redisClient.sRem(`likes:${postId}`, userId);
    await redisClient.sRem(`likedPosts:${userId}`, postId);
});

likes.get("/getLikes/:postId", async c => {
    const postId = c.req.param("postId");
    const likes = await redisClient.sMembers(`likes:${postId}`);
    return c.json({likes});
});

likes.get("/getLikeCount/:postId", async c => {
    const postId = c.req.param("postId");
    const likeCount = await redisClient.sCard(`likes:${postId}`);
    return c.json({likeCount});
});

likes.get("/isLiked/:postId/:userId", async c => {
    const postId = c.req.param("postId");
    const userId = c.req.param("userId");
    const isLiked = await redisClient.sIsMember(`likes:${postId}`, userId);
    return c.json({isLiked});
});

likes.get("/getLikedPosts/:userId", async c => {
    const userId = c.req.param("userId");
    const likedPosts = await redisClient.sMembers(`likedPosts:${userId}`);
    return c.json({likedPosts});
});

export default likes;