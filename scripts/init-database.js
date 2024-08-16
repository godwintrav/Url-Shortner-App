import { createDatabase } from "../models/migrations/create-database.js";

//script for initialising database
(async () => {
  try {
    await createDatabase();
    console.log("Database setup completed.");
    process.exit(0);
  } catch (err) {
    console.error("Database setup failed:", err);
    process.exit(1);
  }
})();
