import { escapeLongUrl } from "../utils/escape-long-url.js";
import validator from "validator";
import { createShortUrl } from "../services/create-url-service.js";
import { getLongUrl } from "../services/get-url-service.js";

export const createShortUrlHandler = async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl || !validator.isURL(longUrl, { require_protocol: true })) {
    return res.status(400).json({ error: "Invalid long URL passed" });
  }

  try {
    const sanitizedLongUrl = escapeLongUrl(validator.trim(longUrl));
    const result = await createShortUrl(sanitizedLongUrl, req.ip);
    return res.status(201).json(result);
  } catch (err) {
    //console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const redirectToUrlHandler = async (req, res) => {
  const shortUrl = req.params.short_url;
  const validatedShortUrl = validator.escape(validator.trim(shortUrl));
  try {
    const longUrl = await getLongUrl(validatedShortUrl, req.ip);
    if (longUrl === false) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.redirect(302, longUrl);
  } catch (err) {
    //console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
