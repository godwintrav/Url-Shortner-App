import { getConnection } from "../../config/connection.js";

export const dropDatabase = async () => {
  try {
    //check environment variable to know if this is for test or not and set the appropriate database
    const dbName = process.env.isTest
      ? process.env.TEST_DB
      : process.env.MYSQL_DATABASE;
    //get connection form database connection pool singleton
    const connection = await getConnection();
    await connection.query(`DROP DATABASE \`${dbName}\``);

    //release connection after query to prevent memory leaks
    connection.release();
  } catch (err) {
    console.error("Error dropping database:", err);
    throw err;
  }
};
