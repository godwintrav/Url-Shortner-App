import { escapeLongUrl } from "../escape-long-url.js";

describe("escapeLongUrl", () => {
  it("should replace strings containing HTML special characters", () => {
    const unsanitizedLongUrl =
      "http://localhost:8080/<script>alert('xss')</script>";
    const expectedResult =
      "http://localhost:8080/&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;";
    const result = escapeLongUrl(unsanitizedLongUrl);
    expect(result).toEqual(expectedResult);
  });

  it("should return correct url string", () => {
    const correctLongUrl = "http://localhost:8080/asbg";
    const result = escapeLongUrl(correctLongUrl);
    expect(result).toEqual(correctLongUrl);
  });
});
