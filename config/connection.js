import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let connectionPool = null;
const configObject = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create the connection pool
export function getConnectionPool(isDbInit = false) {
  if (!isDbInit) {
    if (!connectionPool) {
      const dbName = process.env.isTest
        ? process.env.TEST_DB
        : process.env.MYSQL_DATABASE;
      connectionPool = mysql.createPool({
        ...configObject,
        database: dbName,
      });
    }
  } else {
    return mysql.createPool(configObject);
  }

  return connectionPool;
}

export async function getConnection() {
  return await getConnectionPool().getConnection();
}
