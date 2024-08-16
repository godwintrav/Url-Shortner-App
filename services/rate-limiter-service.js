const rateLimitcache = {};
//time period for rate limiting
const RATE_LIMIT_TIME_PERIOD_IN_SECONDS = 60;

export function rateLimiter(ip) {
  //set current time
  const currentTime = Date.now();

  //check if ip has been added to rate limit cache before
  if (rateLimitcache[ip]) {
    //increment ip total request count
    rateLimitcache[ip].totalRequestCount++;

    //get time difference with last time user made request and now
    const timeDifferenceInSeconds =
      (currentTime - rateLimitcache[ip].timeAccessed) / 1000;

    //check if time difference is within rate limit period
    if (timeDifferenceInSeconds <= RATE_LIMIT_TIME_PERIOD_IN_SECONDS) {
      //if time difference is less than or equal to 60 seconds then check if rate limit count is less than or equal to 10
      if (rateLimitcache[ip].rateLimitCount <= 10) {
        //increment rate limit count if not greater than 10 and time difference within rate limit period
        rateLimitcache[ip].rateLimitCount++;
      } else {
        //return false is rate limit count is greater than 10 and time difference within rate limit period
        return false;
      }
    } else {
      //reset rate limit count if time difference not within rate limit period
      rateLimitcache[ip].rateLimitCount = 1;

      //update last time accessed
      rateLimitcache[ip].timeAccessed = currentTime;
    }
  } else {
    //add ip to rate limit cache if not added before
    rateLimitcache[ip] = {
      rateLimitCount: 1,
      timeAccessed: currentTime,
      totalRequestCount: 1,
    };
  }

  return true;
}
