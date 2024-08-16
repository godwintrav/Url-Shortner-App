import { escapeLongUrl } from "../utils/escape-long-url.js";
import validator from "validator";
import { createShortUrl } from "../services/create-url-service.js";
import { getLongUrl } from "../services/get-url-service.js";

export const createShortUrlHandler = async (req, res) => {
  //destructure request body
  const { longUrl } = req.body;

  //check if long url is a valid url with protocol
  if (!longUrl || !validator.isURL(longUrl, { require_protocol: true })) {
    return res.status(400).json({ error: "Invalid long URL passed" });
  }

  try {
    //sanitize and trim long url passed from user for security purposes before sending to database
    const sanitizedLongUrl = escapeLongUrl(validator.trim(longUrl));
    const result = await createShortUrl(sanitizedLongUrl, req.ip);

    //return status code 201 and new url mapping
    return res.status(201).json(result);
  } catch (err) {
    //console.log(err);
    //return internal server error status code
    return res.status(500).json({ error: err.message });
  }
};

export const redirectToUrlHandler = async (req, res) => {
  //get short url from request parameter
  const shortUrl = req.params.short_url;

  //trim and escape passed short url
  const validatedShortUrl = validator.escape(validator.trim(shortUrl));

  try {
    //get the associated long url from the short url passed
    const longUrl = await getLongUrl(validatedShortUrl, req.ip);

    //if no long url was passed return 404
    if (longUrl === false) {
      return res.status(404).json({ error: "Not found" });
    }

    //redirect to found long url
    return res.redirect(302, longUrl);
  } catch (err) {
    //console.log(err);
    //return internal server error status code
    return res.status(500).json({ error: err.message });
  }
};
