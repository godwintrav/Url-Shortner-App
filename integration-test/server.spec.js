import { createDatabase } from "../models/migrations/create-database.js";
import { dropDatabase } from "../models/migrations/drop-database.js";
import request from "supertest";
import app from "../server.js";
import { createTables } from "../models/migrations/create-tables.js";
import { mockUrlMappingResponse } from "../utils/mocks.js";
import { getConnectionPool } from "../config/connection.js";
import * as createShortUrlModule from "../services/create-url-service.js";
import * as getLongUrlModule from "../services/get-url-service.js";

describe("server.js", () => {
  // set isTest environment variable to help set test database when creating database
  process.env.isTest = true;

  //set test ipaddress
  const testIpAddress = "::ffff:127.0.0.1";
  const unexpectedErrorMsg = "Unexpected Error";
  const randomUrl = "random";

  beforeAll(async () => {
    //initialize database and tables for test
    await createDatabase();
    await createTables();
  });

  afterAll(async () => {
    //cleanup database and close all connections
    await dropDatabase();
    app.close();
    await getConnectionPool().end();
  });

  afterEach(() => {
    //restore all mocks to original state after each test block
    jest.restoreAllMocks();
  });

  describe("GET /:short_url", () => {
    it("should redirect with status code 302 to long url", async () => {
      const body = { longUrl: mockUrlMappingResponse.long_url };

      const postResponse = await request(app)
        .post("/shorten")
        .send(body)
        .expect(201);
      const short_url = postResponse.body.short_url.slice(-6);
      const getResponse = await request(app).get(`/${short_url}`).expect(302);

      //assert headers location is changed after redirect
      expect(getResponse.headers.location).toEqual(body.longUrl);
    });

    it("should return Not Found with status code 404 if short url not found", async () => {
      const response = await request(app).get(`/${randomUrl}`).expect(404);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: "Not found",
        })
      );
    });

    it("should return 500 internal server error if unexpected error occurs", async () => {
      //mock getLongUrl Function to throw an unexpected error
      const getLongUrlModuleSpy = jest
        .spyOn(getLongUrlModule, "getLongUrl")
        .mockImplementation(() => {
          throw new Error(unexpectedErrorMsg);
        });

      const response = await request(app).get(`/${randomUrl}`).expect(500);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: unexpectedErrorMsg,
        })
      );
      //assert how many times mock getLongUrl function was called and what parameters were passed
      expect(getLongUrlModuleSpy).toBeCalledTimes(1);
      expect(getLongUrlModuleSpy).toBeCalledWith(randomUrl, testIpAddress);
    });
  });

  describe("POST /shorten", () => {
    it("should store a new URL mapping", async () => {
      const body = { longUrl: mockUrlMappingResponse.long_url };

      const response = await request(app)
        .post("/shorten")
        .send(body)
        .expect(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: 2,
          short_url: expect.any(String),
          long_url: body.longUrl,
          creator_ip_address: testIpAddress,
          created: expect.any(String),
          click_count: 0,
        })
      );
    });

    it("should return 400 when empty body is sent", async () => {
      const body = {};

      const response = await request(app)
        .post("/shorten")
        .send(body)
        .expect(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: "Invalid long URL passed",
        })
      );
    });

    it("should return 400 when invalid long_url is sent", async () => {
      const body = { longUrl: "www.google." };

      const response = await request(app)
        .post("/shorten")
        .send(body)
        .expect(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: "Invalid long URL passed",
        })
      );
    });

    it("should return 500 internal server error if unexpected error occurs", async () => {
      //mock createShortUrl Function to throw an unexpected error
      const createShortUrlModuleSpy = jest
        .spyOn(createShortUrlModule, "createShortUrl")
        .mockImplementation(() => {
          throw new Error(unexpectedErrorMsg);
        });

      const body = { longUrl: mockUrlMappingResponse.long_url };

      const response = await request(app)
        .post("/shorten")
        .send(body)
        .expect(500);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: unexpectedErrorMsg,
        })
      );
      //assert how many times mock createShortUrl function was called and what parameters were passed
      expect(createShortUrlModuleSpy).toBeCalledTimes(1);
      expect(createShortUrlModuleSpy).toBeCalledWith(
        body.longUrl,
        testIpAddress
      );
    });

    it("should return 429 if too many requests sent at once", async () => {
      const body = { longUrl: mockUrlMappingResponse.long_url };

      for (let i = 0; i <= 10; i++) {
        await request(app).post("/shorten").send(body);
      }

      const response = await request(app)
        .post("/shorten")
        .send(body)
        .expect(429);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Too many requests, please try again in 1 minute",
        })
      );
      expect(response.statusCode).toEqual(429);
    });
  });
});
