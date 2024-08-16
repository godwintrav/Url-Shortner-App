import express from "express";
import { router } from "./routes/route.js";
import { rateLimiterMiddleware } from "./middleware/middleware.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

//Middleware to parse JSON request bodies
app.use(express.json());

//rate limiter middleware
app.use(rateLimiterMiddleware);

app.use(router);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//404 not found
app.use((req, res) => {
  return res.status(404).json({ error: "URL not found" });
});

export default server;
