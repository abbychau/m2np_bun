import {Hono} from "hono";
import { redisClient, dbInsert } from "../db";
const relations = new Hono();

relations.post("/followUser", async c => {
    const body = await c.req.json();
    const userId = body.userId;
    const targetUserId = body.targetUserId;

    //sAdd
    await redisClient.sAdd(`following:${userId}`, targetUserId);
    await redisClient.sAdd(`followers:${targetUserId}`, userId);

    //dbInsert
    await dbInsert("follows", {
        "user_id": userId,
        "target_user_id": targetUserId
    });
});

relations.post("/unfollowUser", async c => {
    const body = await c.req.json();
    const userId = body.userId;
    const targetUserId = body.targetUserId;

    //sRem
    await redisClient.sRem(`following:${userId}`, targetUserId);
    await redisClient.sRem(`followers:${targetUserId}`, userId);

    //dbDelete
    await dbInsert("follows", {
        "user_id": userId,
        "target_user_id": targetUserId
    });
});

relations.get("/getFollowers/:userId", async c => {
    const userId = c.req.param("userId");
    const followers = await redisClient.sMembers(`followers:${userId}`);
    return c.json({followers});
});

relations.get("/getFollowing/:userId", async c => {
    const userId = c.req.param("userId");
    const following = await redisClient.sMembers(`following:${userId}`);
    return c.json({following});
});

relations.post("/inviteUserAsFriend", async c => {
    const body = await c.req.json();
    const userId = body.userId;
    const targetUserId = body.targetUserId;

    await redisClient.sAdd(`friendInvitations:${targetUserId}`, userId);
});

relations.post("/acceptFriendInvitation", async c => {
    const body = await c.req.json();
    const userId = body.userId;
    const targetUserId = body.targetUserId;

    await redisClient.sAdd(`friends:${userId}`, targetUserId);
    await redisClient.sAdd(`friends:${targetUserId}`, userId);

    await redisClient.sRem(`friendInvitations:${userId}`, targetUserId);
});

relations.post("/rejectFriendInvitation", async c => {
    const body = await c.req.json();
    const userId = body.userId;
    const targetUserId = body.targetUserId;

    await redisClient.sRem(`friendInvitations:${userId}`, targetUserId);
    //add notification to inviter
    await redisClient.lPush(`notifications:${targetUserId}`, `${userId} rejected your friend invitation`);
});

relations.get("/getFriendInvitations/:userId", async c => {
    const userId = c.req.param("userId");
    const friendInvitations = await redisClient.sMembers(`friendInvitations:${userId}`);
    return c.json({friendInvitations});
});

relations.get("/getFriends/:userId", async c => {
    const userId = c.req.param("userId");
    const friends = await redisClient.sMembers(`friends:${userId}`);
    return c.json({friends});
});


export default relations;