import * as urlMappingsModule from "../../models/url_mapping.js";
import { generateUniqueUrl } from "../generate-unique-short-url.js";
describe("generateUniqueUrl", () => {
  it("should generate random UUID if getURL returns undefined", async () => {
    const getUrlMappingSpy = jest
      .spyOn(urlMappingsModule, "getUrl")
      .mockImplementation(() => undefined);

    const result = await generateUniqueUrl();
    expect(typeof result).toEqual("string");
    expect(getUrlMappingSpy).toBeCalledTimes(1);
    expect(getUrlMappingSpy).toBeCalledWith(result);
  });
});
