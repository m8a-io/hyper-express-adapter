<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


This is an experimental package for a [hyper-express](https://github.com/kartikk221/hyper-express) adapter for NestJS.


## Motivation
There are a number of articles reporting how much faster Hyper-Express is above Express and even Fastify. 
 - [Bench Marks from the Hyper Express author](https://github.com/kartikk221/hyper-express/blob/master/docs/Benchmarks.md)
 - [The Fastest Frameworks for Node](https://medium.com/deno-the-complete-reference/node-js-the-fastest-web-framework-in-2024-fa11e513fa75)

Hyper-Express gets its speed from using [uWebSockets.js](https://github.com/uNetworking/uWebSockets), which is a Node.js WebSocket library. It is the fastest Node.js WebSocket library available. It is written in C++ and compiles to native code. It is also the fastest and most memory efficient Node.js HTTP library available. 

This project attempts to create a NestJS adapter for Hyper-Express.

## What this project offers

This project offers Nestjs adapters for Hyper-Express. They are currently alpha and feature incomplete.

| Package | Description |
| --- | --- |
| [@m8a/platform-hyper-express](https://github.com/m8a-io/hyper-express-adapter/tree/dev/libs/platform-hyper-express) |  This is the NestJS HTTP server platform based on Hyper Express. |
| [@m8a/hyper-express-adapter-ws](https://github.com/m8a-io/hyper-express-adapter/tree/dev/libs/platform-hyper-express-ws) | This is the NestJS adapter for Websocket connectivity based on Hyper Express.|
| hyper-express | This is a submodule for the hyper-express library in case it is needed to make changes too. If you do need to make changes, let me know and I'll make the necessary PRs to that project. |

## Requirements

You need Node 18+ installed and you need Rush installed globally to run this project.

## Installation

```bash

npm install -g @microsoft/rush #install Rush, if you haven't already

```

Then, clone the repo:

```bash
git clone https://github.com/m8a-io/hyper-express-adapter.git

```
Now cd into the repo folder and run:

```bash
cd hyper-express-adapter

rush update

rush build

```


## Test development

First, cd into the test app directory

```bash

cd apps/hyper-express-test-app

```
Open a second terminal, cd into`libs/hyper-express-adapter` and run:

```bash
cd libs/hyper-express-adapter

rushx build:watch
```

Then, in the first terminal run:

```bash

rushx test:integrations:watch

``` 


## Running the app

If you aren't there already, cd into the test app directory

```bash

cd apps/hyper-express-test-app

```

Then, run:

```bash
rushx start # or start:dev
``` 

## Websocket Test Status

  Websocket tests (Needs adapter work and possible test rewrite)
   [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/10)
  - [ ] - error-gateway.spec.ts
  - [ ] - gateway-ack.spec.ts
  - [ ] - gateway.spec.ts
  - [ ] - ws-gateway.spec.ts

## HTTP Test Status

 - [X] - cors - all tests pass
 - [X] - hello-world/exceptions - all tests pass
 - [ ] - hello-world/exclude-middleware-hyper-express - all tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/9)
 - [X] - hello-world/guards - all tests pass
 - [X] - hello-world/hello-world-base - all tests pass
 - [ ] - hello-world/hyper-express-instance - 1 of 4 tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/11)
 - [X] - hello-world/hyper-express-multiple - all tests pass
 - [ ] - hello-world/include-middleware - all tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/13)
 - [X] - hello-world/interceptors - all tests pass
 - [ ] - hello-world/local-pipes - 1 of 3 tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/14)
 - [ ] - hello-world/middleware - 1 of 3 tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/15)
 - [ ] - hello-world/middleware-class - all tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/16)
 - [X] - hello-world/middleware-execute-order - all tests pass
 - [ ] - hello-world/middleware-run-match-route - all tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/17)
 - [ ] - hello-world/middleware-with-versioning - all tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/18)
 - [ ] - hello-world/router-module-middleware - 2 of 3 tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/19)
 - [X] - hello-world/router-module - all tests pass
 - [X] - nest-application/app-locals - all tests pass
 - [ ] - nest-application/get-url - suite FAILS [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/20)
 - [ ] - nest-application/global-prefix - all tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/21)
 - [ ] - nest-application/listen - 1 of 3 tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/22)
 - [ ] - nest-application/raw-body - all tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/23)
 - [ ] - nest-application/sse - all tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/24)
 - [ ] - nest-application/use-body-parser - all tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/25)
 - [ ] - nest-application/send-files - 2 of 6 tests FAIL [Issue](https://github.com/m8a-io/hyper-express-adapter/issues/26)


## Usage 

Currently, this adapter is not published to npm. To use it, you will need to clone this repo and build it locally. 

   