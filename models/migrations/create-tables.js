import { getConnection } from "../../config/connection.js";

export const createTables = async () => {
  try {
    const connection = await getConnection();
    await connection.query(`
      CREATE TABLE url_mappings (
        id integer PRIMARY KEY AUTO_INCREMENT,
        short_url VARCHAR(10) NOT NULL UNIQUE,
        long_url VARCHAR(255) NOT NULL,
        click_count integer NOT NULL,
        creator_ip_address VARCHAR(45) NOT NULL,
        created TIMESTAMP NOT NULL DEFAULT NOW()
      );

      
    `);

    await connection.query(`
        CREATE TABLE url_analytics (
        id integer PRIMARY KEY AUTO_INCREMENT,
        url_id integer NOT NULL,
        accessed_time TIMESTAMP NOT NULL DEFAULT NOW(),
        user_ip_address VARCHAR(45) NOT NULL,
        FOREIGN KEY (url_id) REFERENCES url_mappings(id) ON DELETE CASCADE
      );
      `);
    connection.release();
  } catch (err) {
    console.error("Error creating tableS:", err);
    throw err;
  }
};
