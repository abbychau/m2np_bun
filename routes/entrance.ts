import { Hono } from "hono";
import { redisClient, db } from "../db";
// crypto sha256
import {createHash, randomUUID} from "crypto";

import { time } from "console";
import { reservedUsernames } from "../const";
const entrance = new Hono();

function hashPassword(password: string) : string {
    const res = createHash("sha256").update(password + 'SECRET').digest('hex');//TODO: use salt
    return res;    
}

// login
entrance.post("/login", async c => {
    const body = await c.req.json();
    console.log(body);
    const username = body.username;
    let password = body.password;
    password = hashPassword(password);
    const user = await db.Row("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);

    if (!user) {
        return c.json({error: "Invalid username or password"}, 401);
    }

    // generate token
    const randSource = time() + randomUUID();
    const token = createHash("sha256").update(randSource).digest('hex');

    // save token
    await redisClient.set(`token:${token}`, user.id);

    return c.json({"token": token});
});

// logout
entrance.post("/logout", async c => {
    const body = await c.req.json();
    const token = body.token;

    await redisClient.del(`token:${token}`);
    return c.json({success: true});
});


// register
entrance.post("/register", async c => {
    const body = await c.req.json();
    const username = body.username;
    let password = body.password;
    password = hashPassword(password);

    if(username.length < 3 || password.length < 3) {
        return c.json({error: "Username and password must be at least 3 characters long"}, 400);
    }

    if(username.length > 20) {
        return c.json({error: "Username must be at most 20 characters long"}, 400);
    }

    if(reservedUsernames.includes(username)) {
        return c.json({error: "Username is reserved"}, 400);
    }

    const user = await db.Row("SELECT * FROM users WHERE username = ?", [username]);

    if (user) {
        return c.json({error: "Username already exists"}, 400);
    }

    await db.Insert("users", {
        "username": username,
        "password": password
    });

    return c.json({success: true});
});

export default entrance;