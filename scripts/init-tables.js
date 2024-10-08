import { createTables } from "../models/migrations/create-tables.js";

//script for initialising tables
(async () => {
  try {
    await createTables();
    console.log("Tables setup completed.");
    process.exit(0);
  } catch (err) {
    console.error("Tables setup failed:", err);
    process.exit(1);
  }
})();
