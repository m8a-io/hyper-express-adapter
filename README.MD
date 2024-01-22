This is an experimental package for a [hyper-express] adapter for NestJS.


## Requirements

You need Rush installed globally to run this project.

## Installation

```bash

npm install -g @microsoft/rush #install Rush, if you haven't already

rush install

```


## Test development

First, cd into the test app directory

```bash

cd apps/hyper-express-test-app

```
Open a second terminal, cd into libs/hyper-express-adapter and run:

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
