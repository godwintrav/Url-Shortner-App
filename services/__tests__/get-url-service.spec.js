import * as urlMappingsModule from "../../models/url_mapping.js";
import { getLongUrl } from "../get-url-service.js";
import * as urlAnalyticsModule from "../../models/url_analytics.js";
import {
  mockUrlMappingResponse,
  mockIpAddress,
  mockUniqueUrl,
} from "../../utils/mocks.js";

let getUrlMappingSpy;
let createAnalyticsSpy;
let updateClickCountSpy;

describe("getLongUrl", () => {
  beforeEach(() => {
    getUrlMappingSpy = jest.spyOn(urlMappingsModule, "getUrl");
    createAnalyticsSpy = jest.spyOn(urlAnalyticsModule, "createAnalytics");
    updateClickCountSpy = jest.spyOn(urlMappingsModule, "updateClickCount");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return false if no url result is found", async () => {
    getUrlMappingSpy.mockImplementation(() => undefined);
    const result = await getLongUrl(mockUniqueUrl, mockIpAddress);
    expect(result).toEqual(false);
    expect(getUrlMappingSpy).toBeCalledTimes(1);
    expect(getUrlMappingSpy).toBeCalledWith(mockUniqueUrl);
    expect(createAnalyticsSpy).toBeCalledTimes(0);
    expect(updateClickCountSpy).toBeCalledTimes(0);
  });

  it("should return found long url from database and increase click count", async () => {
    getUrlMappingSpy.mockImplementation(() => mockUrlMappingResponse);
    createAnalyticsSpy.mockImplementation(() => true);
    updateClickCountSpy.mockImplementation(() => true);
    const result = await getLongUrl(mockUniqueUrl, mockIpAddress);
    expect(result).toEqual(mockUrlMappingResponse.long_url);
    expect(getUrlMappingSpy).toBeCalledTimes(1);
    expect(getUrlMappingSpy).toBeCalledWith(mockUniqueUrl);
    expect(createAnalyticsSpy).toBeCalledTimes(1);
    expect(createAnalyticsSpy).toBeCalledWith(
      mockUrlMappingResponse.id,
      mockUrlMappingResponse.creator_ip_address
    );
    expect(updateClickCountSpy).toBeCalledTimes(1);
    mockUrlMappingResponse.click_count++;
    expect(updateClickCountSpy).toBeCalledWith(
      mockUrlMappingResponse.click_count,
      mockUrlMappingResponse.id
    );
  });
});
