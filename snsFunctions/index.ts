import { redisClient } from "../db";


async function isMutualFollow(userId: string, targetUserId: string): Promise<boolean> {
    if(userId === targetUserId) return true;

    const following = await redisClient.sIsMember(`following:${userId}`, targetUserId);
    const followers = await redisClient.sIsMember(`followers:${targetUserId}`, userId);

    return following && followers;
}

async function addNotification(userId: string, notification: string) {
    await redisClient.lPush(`notifications:${userId}`, notification);
}

async function shouldSeePost(post: any, userId: string){
    if(post.is_anonymous) {
        return true;
    }else{
        // check if he can see the post
        if(post.is_private) {
            // check if they are friends
            const friends = await redisClient.sMembers(`friends:${userId}`);
            if(!friends.includes(post.user_id)) {
                return false
            }
        }
    }
    return true;
}

export { isMutualFollow, addNotification, shouldSeePost };