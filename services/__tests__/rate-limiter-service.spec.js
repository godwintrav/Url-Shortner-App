import { mockIpAddress } from "../../utils/mocks.js";
import { rateLimiter } from "../rate-limiter-service.js";

describe("rateLimiter", () => {
  it("should return true if ip access rateLimiter once", () => {
    expect(rateLimiter(mockIpAddress)).toEqual(true);
  });
  it("should return false if ip access rateLimiter more than 10 times", () => {
    for (let i = 0; i <= 10; i++) {
      rateLimiter(mockIpAddress);
    }

    expect(rateLimiter(mockIpAddress)).toEqual(false);
  });
});
