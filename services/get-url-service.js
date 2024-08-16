import { createAnalytics } from "../models/url_analytics.js";
import { getUrl, updateClickCount } from "../models/url_mapping.js";

export async function getLongUrl(shortUrl, userIp) {
  //call getUrl to get long url from database
  const result = await getUrl(shortUrl);

  //check if result was found
  if (!result) {
    return false;
  }

  //parse click count to integer and increment
  let clickCount = parseInt(result.click_count);
  clickCount++;

  //update click count with incremented value
  await updateClickCount(clickCount, result.id);

  //add ananlytics for recent click
  await createAnalytics(result.id, userIp);

  //return long url
  return result.long_url;
}
