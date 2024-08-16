const rateLimitcache = {};
const RATE_LIMIT_TIME_PERIOD_IN_SECONDS = 60;

export function rateLimiter(ip) {
  const currentTime = Date.now();
  if (rateLimitcache[ip]) {
    rateLimitcache[ip].totalRequestCount++;
    const timeDifferenceInSeconds =
      (currentTime - rateLimitcache[ip].timeAccessed) / 1000;

    if (timeDifferenceInSeconds <= RATE_LIMIT_TIME_PERIOD_IN_SECONDS) {
      if (rateLimitcache[ip].rateLimitCount <= 10) {
        rateLimitcache[ip].rateLimitCount++;
      } else {
        return false;
      }
    } else {
      rateLimitcache[ip].rateLimitCount = 1;
      rateLimitcache[ip].timeAccessed = currentTime;
    }
  } else {
    rateLimitcache[ip] = {
      rateLimitCount: 1,
      timeAccessed: currentTime,
      totalRequestCount: 1,
    };
  }

  return true;
}
