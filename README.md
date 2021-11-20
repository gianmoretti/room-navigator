# Calc Path application

The Calc Path application is written in Typescript on Node.js, using express to expose the API service `/calc-path`.

The `calc-path` method has to be called in `POST` passing this list of query parameters:

- `startingRoom`

- `objectsToCollect`

and `roomMap` as JSON body.

Technically, the search algorithm for traversing the room graph is a "Depth-first".

In the file `Room-Navigator.postman_collection.json` few samples of requests are present. They could be used for end-to-end tests (from POSTMAN client).

## Installation

Follow these instructions for installing dependencies, building, running tests, verifying source code format, and starting the application.

```sh
npm install
npm run build
npm run test
npm run eslint
npm run start
```

## Docker commands

From the application root, the docker commands used are listed below:

```sh
docker build -t mytest .
docker run -v $(pwd):/mnt -p 9090:9090 -w /mnt mytest ./scripts/build.sh
docker run -v $(pwd):/mmt -p 9090:9090 -w /mnt mytest ./scripts/tests.sh
docker run -v $(pwd):/mnt -p 9090:9090 -w /mnt mytest ./scripts/run.sh
```

## Plugins and libraries

For the implementation, I've used these libraries:

| Plugin | Goal |
| ------ | ------ |
| Express | HTTP API server |
| Jest | Unit test library |
| Supertest | For testing HTTP API |
| TypeMoq | Mocking library |
| EsLint | Code Formatter |
| Typescript Logging | Logging library |
