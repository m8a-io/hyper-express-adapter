
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


This is an experimental package for a [hyper-express](https://github.com/kartikk221/hyper-express) adapter for NestJS.


## Requirements

You need Rush installed globally to run this project.

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

└─ hyper-express-adapter-new
   [] - middleware-class.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - middleware-execute-order.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - middleware-run-match-route.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - middleware-with-versioning.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - middleware.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - router-module-middleware.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - router-module.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - hyper-express-get-url.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - global-prefix.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - hyper-express.spec.ts
   │  └─ line 76: TODO : temporarily turned off (flaky test)
   [] - fastify.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - error-gateway.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - gateway-ack.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - gateway.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - ws-gateway.spec.ts
   │  └─ line 1: TODO : rewrite test for hyper-express, if needed
   [] - ack.gateway.ts
   │  └─ line 1: TODO : need to use hyper-express ws
   [] - app.gateway.ts
   │  └─ line 1: TODO : need to use hyper-express ws
   [] - core.gateway.ts
   │  └─ line 1: TODO : need to use hyper-express ws
   [] - error.gateway.ts
   │  └─ line 1: TODO : need to use hyper-express ws
   [] - example-path.gateway.ts
   │  └─ line 1: TODO : need to use hyper-express ws
   [] - namespace.gateway.ts
   │  └─ line 1: TODO : need to use hyper-express ws
   [] - request.filter.ts
   │  └─ line 1: TODO : need to use hyper-express ws
   [] - server.gateway.ts
   │  └─ line 1: TODO : need to use hyper-express ws
   [] - ws-path.gateway.ts
   │  └─ line 1: TODO : need to use hyper-express ws
   └─ ws-path2.gateway.ts
      └─ line 1: TODO : need to use hyper-express ws
