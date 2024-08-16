export const mockUniqueUrl = "random";
export const mockLongUrl = "url";
export const mockIpAddress = "::1";
export const mockUrlMappingResponse = {
  id: 41,
  short_url: `${mockUniqueUrl}`,
  long_url: "https://www.google.co.uk/",
  creator_ip_address: "::1",
  created: "2024-08-14T23:16:32.000Z",
  click_count: 2,
};

export const mockResult = {
  ...mockUrlMappingResponse,
  short_url: `http://localhost:8080/${mockUniqueUrl}`,
};
