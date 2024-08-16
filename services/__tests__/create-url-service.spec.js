import * as generateUrlModule from "../../utils/generate-unique-short-url.js";
import * as urlMappingsModule from "../../models/url_mapping.js";
import { createShortUrl } from "../create-url-service.js";
import {
  mockIpAddress,
  mockLongUrl,
  mockResult,
  mockUniqueUrl,
  mockUrlMappingResponse,
} from "../../utils/mocks.js";

describe("createShortUrl", () => {
  it("should create short url", async () => {
    const generateUrlModuleSpy = jest
      .spyOn(generateUrlModule, "generateUniqueUrl")
      .mockImplementation(() => mockUniqueUrl);
    const createUrlMappingSpy = jest
      .spyOn(urlMappingsModule, "createUrlMapping")
      .mockImplementation(() => mockUrlMappingResponse);
    const result = await createShortUrl(mockLongUrl, mockIpAddress);
    expect(result).toEqual(mockResult);
    expect(generateUrlModuleSpy).toBeCalledTimes(1);
    expect(generateUrlModuleSpy).toBeCalledWith();
    expect(createUrlMappingSpy).toBeCalledTimes(1);
    expect(createUrlMappingSpy).toBeCalledWith(
      mockUniqueUrl,
      mockLongUrl,
      mockIpAddress
    );
  });
});
