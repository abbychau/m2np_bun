import mysql from 'mysql2';
import redis, { ClientClosedError } from 'redis';

const pool = mysql.createPool({
    host: '172.31.64.1',
    user: 'root',
    password: '1234',
    database: 'm2np',
});
/*
grant to all ip
CREATE USER 'root'@'%' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234' WITH GRANT OPTION;
 FLUSH PRIVILEGES;
*/

// return a 2D array
async function dbAr(sql: string, params: string[] = []) {
    try {
        const promisePool = pool.promise();
        const [rows, fields] = await promisePool.query(sql, params);

        return rows as any[];
    } catch (err) {
        console.log(err);
        return null;
    }
}

// return a 1D array
async function dbRow(sql: string, params: string[] = []) {
    const v = await dbAr(sql, params);
    return v ? v[0] : null;
}



// return a single value
async function dbRs(sql: string, params: string[] = []) {
    const v = await dbRow(sql, params);
    if (!v) return null;
    return v[Object.keys(v)[0]];
}


// is record exists
async function dbIsExist(table: string, where: any) {
    const whereKeys = Object.keys(where);
    const whereValues: string[] = Object.values(where);
    const sql = `SELECT 1 FROM ${table} WHERE ${whereKeys.map((k, i) => `${k} = ?`).join(' AND ')}`;
    return await dbRs(sql, whereValues);
}


// a query exectuion function, return insertId if any
async function dbExec(sql: string, params:string[] = []) {
    const promisePool = pool.promise();
    const [rows, fields] = await promisePool.query(sql) as any;
    return rows.insertId;
}

async function dbInsert(table: string, data: any) {
    const keys = Object.keys(data);
    const values: string[] = Object.values(data);
    const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`;

    const promisePool = pool.promise();
    const [rows, fields] = await promisePool.query(sql, values) as any;
    return rows.insertId;
}

async function dbUpdate(table: string, data: any, where: any) {
    const keys = Object.keys(data);
    const values: string[] = Object.values(data);
    const whereKeys = Object.keys(where);
    const whereValues: string[] = Object.values(where);
    const sql = `UPDATE ${table} SET ${keys.map((k, i) => `${k} = ?`).join(',')} WHERE ${whereKeys.map((k, i) => `${k} = ?`).join(' AND ')}`;
    return await dbExec(sql, values.concat(whereValues));
}

async function dbDelete(table: string, where: any) {
    const whereKeys = Object.keys(where);
    const whereValues: string[] = Object.values(where);
    const sql = `DELETE FROM ${table} WHERE ${whereKeys.map((k, i) => `${k} = ?`).join(' AND ')}`;
    return await dbExec(sql, whereValues);
}

//test connection
const [k] = await pool.promise().query('SELECT 1 + 1 AS solution') as any;
if (k[0].solution === 2) {
    console.log('Connected to MySQL. Test OK.');
}


const redisClient = redis.createClient({
    url: 'redis://127.0.0.1:6379'
});
redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});
redisClient.on('connect', () => {
    console.log('Connected to Redis.');
});
console.log('Connecting to Redis...');
await redisClient.connect();

const db = {
    Ar: dbAr,
    All: dbAr,
    Row: dbRow,
    Exec: dbExec,
    Rs: dbRs,
    One: dbRs,
    IsExist: dbIsExist,
    Insert: dbInsert,
    Update: dbUpdate,
    Delete: dbDelete
};

export { redisClient, db};