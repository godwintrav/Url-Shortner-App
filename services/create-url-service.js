import { createUrlMapping } from "../models/url_mapping.js";
import { generateUniqueUrl } from "../utils/generate-unique-short-url.js";
import dotenv from "dotenv";

dotenv.config();

export async function createShortUrl(longUrl, userIp) {
  //calls the generate unique url for getting a unique short url
  const shortUrl = await generateUniqueUrl();
  //calls the createUrlMapping function to create a new URL mapping
  const result = await createUrlMapping(shortUrl, longUrl, userIp);
  //appends the short url to the application base url
  result.short_url = `${process.env.BASE_URL}${shortUrl}`;

  //returns result
  return result;
}
