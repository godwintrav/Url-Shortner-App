import { getConnection } from "../../config/connection.js";

export const dropDatabase = async () => {
  try {
    const dbName = process.env.isTest
      ? process.env.TEST_DB
      : process.env.MYSQL_DATABASE;
    const connection = await getConnection();
    await connection.query(`DROP DATABASE \`${dbName}\``);
    connection.release();
  } catch (err) {
    console.error("Error dropping database:", err);
    throw err;
  }
};
