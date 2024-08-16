import { rateLimiter } from "../services/rate-limiter-service.js";

export function rateLimiterMiddleware(req, res, next) {
  const userIp = req.ip;

  if (!userIp) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const result = rateLimiter(userIp);

  if (result === false) {
    return res.status(429).json({
      message: "Too many requests, please try again in 1 minute",
    });
  }

  next();
}
