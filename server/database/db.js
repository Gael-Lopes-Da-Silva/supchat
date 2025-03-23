import mariadb from "mariadb";

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 150,
    bigIntAsNumber: true,
    bigNumberStrings: true,
    supportBigNumbers: true,
    connectTimeout: 10000,
    waitForConnections: true,
    connectionLimit: 150,
    queueLimit: 0,
});

export default pool;
