//This file contains all functions related to url_analytics table

import { getConnection } from "../config/connection.js";

const URL_ANALYTICS_TABLE = "url_analytics";

export async function createAnalytics(url_id, user_ip_address) {
  const connection = await getConnection();
  await connection.query(
    `INSERT INTO ${URL_ANALYTICS_TABLE} (url_id, user_ip_address) VALUES (?, ?)`,
    [url_id, user_ip_address]
  );
  connection.release();
  return true;
}
