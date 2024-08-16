//This file contains all functions related querying and inserting into url_mappings table
import { getConnection } from "../config/connection.js";

const URL_MAPPINGS_TABLE = "url_mappings";

export async function getUrl(shortUrl) {
  //get connection form database connection pool singleton
  const connection = await getConnection();

  //run select query to get url mapping using prepared statements
  const [row] = await connection.query(
    `SELECT * FROM ${URL_MAPPINGS_TABLE} WHERE short_url = ?`,
    [shortUrl]
  );
  connection.release();

  //return url mapping
  return row[0];
}

export async function createUrlMapping(shortUrl, longUrl, creatorIpAddress) {
  //get connection form database connection pool singleton
  const connection = await getConnection();

  //run insert query to save new url mappings using prepared statements
  const [result] = await connection.query(
    `INSERT INTO ${URL_MAPPINGS_TABLE} (short_url, long_url, creator_ip_address, click_count) VALUES (?, ?, ?, ?)`,
    [shortUrl, longUrl, creatorIpAddress, 0]
  );

  //release connection after query to prevent memory leaks
  connection.release();

  //check if insertId is is result object
  if (!result.insertId) {
    //throw error if insertId is not available
    throw new Error("Error Inserting into database");
  }

  //fetch and return new url mapping
  return await getUrl(shortUrl);
}

export async function updateClickCount(clickCount, id) {
  //get connection form database connection pool singleton
  const connection = await getConnection();

  //run update query to increment click count for url mapping using prepared statements
  await connection.query(
    `UPDATE ${URL_MAPPINGS_TABLE} SET click_count = ? WHERE id = ?`,
    [clickCount, id]
  );
  connection.release();
  return true;
}
