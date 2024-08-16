import { rateLimiter } from "../services/rate-limiter-service.js";

export function rateLimiterMiddleware(req, res, next) {
  const userIp = req.ip;

  //check if associated user ip is fetched and if it's not return Unauthorized
  if (!userIp) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  //call the rate limiter service to check user rate limit
  const result = rateLimiter(userIp);

  //return 429 if rate limiter returns false
  if (result === false) {
    return res.status(429).json({
      message: "Too many requests, please try again in 1 minute",
    });
  }

  next();
}
