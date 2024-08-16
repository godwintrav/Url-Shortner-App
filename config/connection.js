import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

//initilise connection pool and set to null
let connectionPool = null;

//set config object
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
  //check if this is not database initialisation
  if (!isDbInit) {
    //if not database initialisation check if connection pool has already been created
    if (!connectionPool) {
      //check environment variable to know if this is for test or not and set the appropriate database
      const dbName = process.env.isTest
        ? process.env.TEST_DB
        : process.env.MYSQL_DATABASE;

      //create connection pool to specified database if not created
      connectionPool = mysql.createPool({
        ...configObject,
        database: dbName,
      });
    }
  } else {
    //if this is database initialization create a connection pool without any database specified
    return mysql.createPool(configObject);
  }

  return connectionPool;
}

//get connection from connection pool
export async function getConnection() {
  return await getConnectionPool().getConnection();
}
