import { getConnectionPool } from "../../config/connection.js";

export const createDatabase = async () => {
  try {
    //check environment variable to know if this is for test or not and set the appropriate database
    const dbName = process.env.isTest
      ? process.env.TEST_DB
      : process.env.MYSQL_DATABASE;

    // create connection pool  which is not a singleton as it is for database initialisation
    const connectionPool = await getConnectionPool(true);

    //get connection from connection pool
    const connection = await connectionPool.getConnection();

    //run query to create database with the specified database name
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);

    //release connection after query to prevent memory leaks
    await connection.release();

    //end connection pool after database is created
    await connectionPool.end();
  } catch (err) {
    console.error("Error creating database:", err);
    throw err;
  }
};
