import { createUrlMapping } from "../models/url_mapping.js";
import { generateUniqueUrl } from "../utils/generate-unique-short-url.js";
import dotenv from "dotenv";

dotenv.config();

export async function createShortUrl(longUrl, userIp) {
  const shortUrl = await generateUniqueUrl();
  const result = await createUrlMapping(shortUrl, longUrl, userIp);
  result.short_url = `${process.env.BASE_URL}${shortUrl}`;

  return result;
}
