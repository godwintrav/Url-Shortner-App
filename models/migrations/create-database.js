import { getConnectionPool } from "../../config/connection.js";

export const createDatabase = async () => {
  try {
    const dbName = process.env.isTest
      ? process.env.TEST_DB
      : process.env.MYSQL_DATABASE;
    const connectionPool = await getConnectionPool(true);
    const connection = await connectionPool.getConnection();

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.release();
    await connectionPool.end();
  } catch (err) {
    console.error("Error creating database:", err);
    throw err;
  }
};
