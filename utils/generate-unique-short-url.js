import { randomUUID } from "crypto";
import { getUrl } from "../models/url_mapping.js";

export async function generateUniqueUrl() {
  let generatedUUID = "";
  let isUnique = false;

  //loop to genrate unique short url and check if exists or not
  while (isUnique == false) {
    generatedUUID = randomUUID().slice(0, 6);
    const existingData = await getUrl(generatedUUID);
    if (!existingData) {
      isUnique = true;
      break;
    }
  }

  return generatedUUID;
}
