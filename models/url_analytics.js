//This file contains all functions related to url_analytics table

import { getConnection } from "../config/connection.js";

const URL_ANALYTICS_TABLE = "url_analytics";

export async function createAnalytics(url_id, user_ip_address) {
  //get connection form database connection pool singleton
  const connection = await getConnection();

  //run insert query to save new url analytics with values passed using prepared statements
  await connection.query(
    `INSERT INTO ${URL_ANALYTICS_TABLE} (url_id, user_ip_address) VALUES (?, ?)`,
    [url_id, user_ip_address]
  );
  //release connection after query to prevent memory leaks
  connection.release();
  return true;
}
