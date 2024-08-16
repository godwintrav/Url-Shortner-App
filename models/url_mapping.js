//This file contains all functions related querying and inserting into url_mappings table
import { getConnection } from "../config/connection.js";

const URL_MAPPINGS_TABLE = "url_mappings";

export async function getUrl(shortUrl) {
  const connection = await getConnection();
  const [row] = await connection.query(
    `SELECT * FROM ${URL_MAPPINGS_TABLE} WHERE short_url = ?`,
    [shortUrl]
  );
  connection.release();
  return row[0];
}

export async function createUrlMapping(shortUrl, longUrl, creatorIpAddress) {
  const connection = await getConnection();
  const [result] = await connection.query(
    `INSERT INTO ${URL_MAPPINGS_TABLE} (short_url, long_url, creator_ip_address, click_count) VALUES (?, ?, ?, ?)`,
    [shortUrl, longUrl, creatorIpAddress, 0]
  );
  connection.release();
  if (!result.insertId) {
    throw new Error("Error Inserting into database");
  }
  return await getUrl(shortUrl);
}

export async function updateClickCount(clickCount, id) {
  const connection = await getConnection();
  await connection.query(
    `UPDATE ${URL_MAPPINGS_TABLE} SET click_count = ? WHERE id = ?`,
    [clickCount, id]
  );
  connection.release();
  return true;
}
