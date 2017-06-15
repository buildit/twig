# Twig

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.22-1 and updated to use the latest 1.0.0.

## Quick Start

```Shell
npm install
npm run serve
```

This builds the app and runs it on a dev server. Navigate to [localhost:4200](http://localhost:4200/). The app will automatically reload if you change any of the source files.

Twig will look for twig-api on localhost. To get a local Twig API started, navigate to [Twig API](https://github.com/buildit/twig-api).

### Quick Start for Twig API

```Shell
npm install
cp .env.example .env
npm start
```

## Why Twig?

The world is becoming a more complex and interconnected space. The relationships between things are as (if not more) important than the things themselves.

We believe the ability to identify how and where people, ideas, and technology converge enables us to ask **why!?**

Our thinking in terms of how we should be able to visualise is inspired in part by [Powers of Ten](https://youtu.be/0fKBhvDjuy0)

**We want a tool that will allow us to:**

* model complex environments without artificial (hierarchical or domain) constraints
* create relationships between things that echo the real world
* create a visual way to explore and traverse these environments
* be able to see changes to the modelled environments over time

There are a lot of domain specific and commercial products out there. We could not find one that met our specific needs so we started building Twig.

## What is Twig?

Twig is a browser-based single-page application using [D3](https://d3js.org/) to render graph visualisations.

Twig allows users to:

* create a graph model (Twiglet)
* define node (vertex) types (including attributes)
* define link (edge) types (including attributes)
* filter a view of the Twiglet based on a node entity type and attributes
* create views that show the Twiglet from a particular aspect devoid of 'noise'
* add, change, and remove nodes and links via the UI
* assign colour and images to node types
* size images (manual and automatic) based on a node's type or attribute value
* create models with nodes and attributes for future Twiglets
* edit the model for a particular Twiglet 

All Twig data is persisted in a CouchdB instance.

[Video demo (Part 1)](https://youtu.be/q4LWoQUeRjc)

### Where is it deployed?

In the Buildit Riglet:

**Staging Environment**: [https://staging-twig.buildit.tools/](https://staging-twig.buildit.tools/)

**Production Environment**: [https://twig.buildit.tools/](https://twig.buildit.tools/)

## Getting Started (how to develop, run it, build, test, analysis)

### Development

#### Logging In 

Once you have set up Twig and Twig API, Twig is read only while logged out. On localhost, there are three ways to log in to Twig to start creating 
twiglets, editing twiglets, etc. 

1. If you are not logged in to the Buildit VPN, you can use the dummy user with email: local@user and password: password. Note that this 
login will only work locally, not on staging or production.

2. With your VPN credentials

3. Using your Wipro email address

#### Linting 

Twig uses linting rules as defined in tslint.json. By default all .ts files are linted.

#### Testing

Twig uses Karma to run unit tests. Want to make a change? Write a test. Write code until it passes. Make sure you didn't break any 
other tests.

Twig uses Protractor for end-to-end tests. End to end tests require that an instance of Twig API is running. Want to make a change? See 
the paragraph above for directions.

Prior to checking in code, be sure to run both unit and end-to-end tests following the instructions outlined below.

#### CI/CD

Twig CI/CD assumes the use of Jenkins Pipeline features (as described by the staging and production groovy scripts in the pipelines directory).

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Before running the tests make sure you are serving the app via `npm run serve`.
Run `npm run test:e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Twig API Documentation

The Twig API is documented using Swagger. If running Twig API locally, navigate to [http://localhost:3000/documentation](http://localhost:3000/documentation) 
to view the documentation.

## User Notes

### Coding Standards

Our coding standards are enforced by automated linters. (See the linting scripts in package.json and tslint.json).

Our Javascript standards are based on Airbnb's [coding standards](https://github.com/airbnb/javascript).

### How to Contribute

This project is currently an internal Buildit project and is not open to external resources. If you are an internal resource, please contact @digitalrigh to gain access to this project.

### Team

@spotted-dog

@aochsner

[Lizzie Szoke](https://github.com/lizziesz)

[@BenAychh](https://github.com/BenAychh)

@mathomas 

### Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

See the [LICENSE](LICENSE.md) file for license rights and limitations (Apache 2.0).

