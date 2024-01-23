
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
the cd into the repo folder and run:

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

TODOS:

└─ hyper-express-adapter open tests and work 
  - [ ] - middleware-class.spec.ts
  - [ ] - middleware-execute-order.spec.ts
  - [ ] - middleware-run-match-route.ts
  - [ ] - middleware-with-versioning.spec.ts
  - [ ] - middleware.spec.ts
  - [ ] - router-module-middleware.spec.ts
  - [ ] - router-module.spec.ts
  - [ ] - hyper-express-get-url.spec.ts
  - [ ] - global-prefix.spec.ts
  - [ ] - hyper-express.spec.ts
  - [ ] - fastify.spec.ts
  - [ ] - error-gateway.spec.ts
  - [ ] - gateway-ack.spec.ts
  - [ ] - gateway.spec.ts
  - [ ] - ws-gateway.spec.ts
  - [ ] - ack.gateway.ts
  - [ ] - app.gateway.ts
  - [ ] - core.gateway.ts
  - [ ] - error.gateway.ts
  - [ ] - example-path.gateway.ts
  - [ ] - namespace.gateway.ts
  - [ ] - request.filter.ts
  - [ ] - server.gateway.ts
  - [ ] - ws-path.gateway.ts
  - [ ] - ws-path2.gateway.ts
   

   ## Usage 

   Currently, this adapter is not published to npm. To use it, you will need to clone this repo and build it locally. 

   