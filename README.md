# Url Shortner App

This a REST API created with Node and Express that creates a short url for a long url and stores it in the database.

## Setup

Install [MySQL](https://dev.mysql.com/) on your device if you don't have one. You can watch how to setup MySQL locally [here](https://www.youtube.com/watch?v=u96rVINbAUI) if you do not have it setup locally;

Set environment variables needed for connection to database and running application. you can check `.env.example` to see all required environment variables.

Now run `npm i` to install all dependencies and dev dependencies.

Run `npm run db:init` to initialise and create the database.

Run `npm run db:migrate` to create the required tables in your database.

Now the setup is complete run `npm run start` to start the application or `npm run dev` to start the application in dev mode which supports hot reload with the help of nodemon.

## Unit and Integration Tests

To run unit and integration tests run the command `npm run test`.

## Server Endpoints

PATH: `/shorten`

METHOD: `POST`

JSON BODY EXAMPLE:

```
{
    "longUrl": "https://www.google.co.uk/"
}

```

SUCCESS RESPONSE: URL Mapping Object and status code `201`;

ERROR RESPONSE:

- Returns `500` if there is an internal server error.
- Returns `400` if invalid body is sent
- Returns `429` if rate limit is exceeded

---

PATH: `/:short_url`

METHOD: `GET`

SUCCESS RESPONSE: Redirects to returned long URL and status code `302`;

ERROR RESPONSE:

- Returns `500` if there is an internal server error.
- Returns `429` if rate limit is exceeded
- Returns `404` if url not found in database
