import { createAnalytics } from "../models/url_analytics.js";
import { getUrl, updateClickCount } from "../models/url_mapping.js";

export async function getLongUrl(shortUrl, userIp) {
  const result = await getUrl(shortUrl);

  if (!result) {
    return false;
  }

  let clickCount = parseInt(result.click_count);
  clickCount++;
  await updateClickCount(clickCount, result.id);
  await createAnalytics(result.id, userIp);
  return result.long_url;
}
