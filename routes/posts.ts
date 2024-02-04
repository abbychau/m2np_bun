import {Hono} from "hono";
import { redisClient, db } from "../db";
import { shouldSeePost } from "../snsFunctions";

const posts = new Hono();

posts.post("/createPost", async c => {
    const body = await c.req.json();
    const userId = c.get("userId");
    const content = body.content;
    const externalId = 0;
    const isAnonymous = body.isAnonymous;
    const isPrivate = body.isPrivate;
    const createdAtSecond = Math.floor(Date.now() / 1000);
    const lastUpdatedAtSecond = createdAtSecond;

    const postId = await db.Insert("posts", {
        "user_id": userId,
        "content": content,
        "external_id": externalId,
        "is_anonymous": isAnonymous,
        "is_private": isPrivate,
        "created_at": createdAtSecond,
        "last_updated_at": lastUpdatedAtSecond
    });

    //add to user's creation timeline
    await redisClient.lPush(`creation_timeline:${userId}`, postId);
    //fanout to followers
    if(!isPrivate && !isAnonymous) {
        const followers = await redisClient.sMembers(`followers:${userId}`);
        for(const follower of followers) {
            await redisClient.lPush(`timeline:${follower}`, postId);
        }
    }
    if(isPrivate && !isAnonymous) {
        // push to friends
        const friends = await redisClient.sMembers(`friends:${userId}`);
        const followers = await redisClient.sMembers(`followers:${userId}`);
        // get intersection (only friends who are also followers should get the post in their timeline)
        const intersection = friends.filter(friend => followers.includes(friend));
        for(const friend of intersection) {
            await redisClient.lPush(`timeline:${friend}`, postId);
        }
    }

    return c.json({postId});
});

posts.post("/deletePost", async c => {
    const body = await c.req.json();
    const postId = body.postId;

    //check if the post exists
    const post = await db.Row("SELECT * FROM posts WHERE id = ?", [postId]);
    if(!post) {
        return c.json({error: "Post not found"}, 404);
    }

    const myUserId = c.get("userId");
    if(post.user_id !== myUserId) {
        return c.json({error: "You are not authorized to delete this post"}, 403);
    }


    //delete post
    await db.Delete("posts", {"id": postId});

    //remove from user's timeline
    const userId = post.user_id;
    await redisClient.lRem(`creationTimeline:${userId}`, 0, postId);

    //remove from followers' timeline
    const followers = await redisClient.sMembers(`followers:${userId}`);
    for(const follower of followers) {
        await redisClient.lRem(`timeline:${follower}`, 0, postId);
    }

    return c.json({success: true});
});

posts.get("/getPost/:postId", async c => {
    const postId = c.req.param("postId");

    const myUserId = c.get("userId");
    
    const post = await db.Row("SELECT * FROM posts WHERE id = ?", [postId]);
    if(!post) {
        return c.json({error: "Post not found"}, 404);
    }

    if(post.is_anonymous) {
        post.user_id = 0;
    }

    const shouldSee = await shouldSeePost(post, myUserId);
    if(!shouldSee) {
        return c.json({error: "You are not authorized to see this post"}, 403);
    }

    return c.json({post});
});

posts.post("/replyToPost", async c => {
    const body = await c.req.json();
    const myUserId = c.get("userId");
    const postId = body.postId;
    const content = body.content;
    const createdAtSecond = Math.floor(Date.now() / 1000);

    const post = await db.Row("SELECT * FROM posts WHERE id = ?", [postId]);
    const shouldSee = await shouldSeePost(post, myUserId);
    if(!shouldSee) {
        return c.json({error: "You are not authorized to see this post"}, 403);
    }

    const replyId = await db.Insert("replies", {
        "user_id": myUserId,
        "post_id": postId,
        "content": content,
        "created_at": createdAtSecond,
        "last_updated_at": createdAtSecond
    });

    //add to post's replies
    await redisClient.lPush(`replies:${postId}`, replyId);

    //add to post's reply number count
    await redisClient.incr(`replyCount:${postId}`);

    //add to user's replies
    await redisClient.sAdd(`myRepliedPosts:${myUserId}`, postId);

    //add to post's repliers list
    await redisClient.sAdd(`repliers:${postId}`, myUserId);

    //add to post's user's notifications
    if(post.user_id !== myUserId) {
        await redisClient.lPush(`notifications:${post.user_id}`, `${myUserId} replied to your post`);
    }

    //add to post's repliers' updated-posts
    const repliers = await redisClient.sMembers(`repliers:${postId}`);
    for(const replier of repliers) {
        await redisClient.sAdd(`updatedPosts:${replier}`, postId);
    }

    return c.json({replyId});
});

posts.post("/deleteReply", async c => {
    const body = await c.req.json();
    const replyId = body.replyId;

    const myUserId = c.get("userId");

    //check if the reply exists
    const reply = await db.Row("SELECT * FROM replies WHERE id = ?", [replyId]);
    if(!reply) {
        return c.json({error: "Reply not found"}, 404);
    }

    if(reply.user_id !== myUserId) {
        return c.json({error: "You are not authorized to delete this reply"}, 403);
    }

    //delete reply
    await db.Delete("replies", {"id": replyId});

    //remove from post's replies
    const postId = reply.post_id;
    await redisClient.lRem(`replies:${postId}`, 0, replyId);

    //decrease post's reply number count
    await redisClient.decr(`replyCount:${postId}`);

    // delete from db
    await db.Delete("replies", {"id": replyId});

    return c.json({success: true});
});


export default posts;
