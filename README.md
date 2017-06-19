# Twig

Twig is a browser-based single-page application using [D3](https://d3js.org/) to render graph visualisations.

## Table of Contents

* [Quick Start for Twig](#quick-start)
* [Quick Start for Twig API](#quick-start-for-twig-api)
* [Why Twig?](#why-twig)
* [What Can Twig Do?](#what-can-twig-do)
* [Demo](#demo)
* [Where is Twig Deployed?](#where-is-it-deployed)
* [Getting Started](#getting-started)
    - [Development](#development)
    - [Build](#build)
    - [Unit Tests](#unit-tests)
    - [End-to-End Tests](#end-to-end-tests)
    - [API Documentation](#twig-api-documentation)
* [User Notes](#user-notes)
    - [How To Contribute](#how-to-contribute)
    - [Tools](#tools)
    - [Team](#team)
    - [License](#license)
    - [Further Help](#further-help)

## Quick Start

Clone this repository, then run

```Shell
npm install
npm run serve
```

This builds the app and runs it on a dev server. Navigate to [localhost:4200](http://localhost:4200/). The app will automatically reload if you change any of the source files.

Twig will look for twig-api on localhost. To get a local Twig API started, navigate to [Twig API](https://github.com/buildit/twig-api).

### Quick Start for Twig API

Please see the Twig API GitHub link above. Clone the Twig API repository, then run 

```Shell
npm install
cp .env.example .env
npm start
```

## Why Twig?

The world is becoming a more complex and interconnected space. The relationships between things are as (if not more) important than the things themselves.

We believe the ability to identify how and where people, ideas, and technology converge enables us to ask **why!?**

Our thinking in terms of how we should be able to visualise is inspired in part by [Powers of Ten](https://youtu.be/0fKBhvDjuy0).

**We want a tool that will allow us to:**

* model complex environments without artificial (hierarchical or domain) constraints
* create relationships between things that echo the real world
* create a visual way to explore and traverse these environments
* be able to see changes to the modelled environments over time

There are a lot of domain specific and commercial products out there. We could not find one that met our specific needs so we started building Twig.

## What Can Twig Do?

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
* add gravity points to float nodes to particular areas of the force graph
* create events to save a snapshot of a Twiglet at a particular moment
* create a sequence to play a collection of events to view how a Twiglet has changed   

All Twig data is persisted in a [CouchdB](http://couchdb.apache.org/) instance.

## Demo 

Click the link to watch an awesome demo of the basics of Twig:

[Video demo (Part 1)](https://youtu.be/q4LWoQUeRjc)

## Where is it deployed?

In the Buildit Riglet:

**Staging Environment**: [https://staging-twig.buildit.tools/](https://staging-twig.buildit.tools/)

**Production Environment**: [https://twig.buildit.tools/](https://twig.buildit.tools/)

## Getting Started

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

### Unit Tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### End-to-End Tests

Before running the tests make sure you are serving the app via `npm run serve`.
Run `npm run test:e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Twig API Documentation

The Twig API is documented using Swagger. If running Twig API locally, navigate to [http://localhost:3000/documentation](http://localhost:3000/documentation) 
to view the documentation.

## User Notes

### How to Contribute

#### Development 

Want to contribute? 

To fix a bug or enhance Twig, follow these stops:

* Fork the repository
* Create a new branch (`git checkout -b improve-feature`)
* Make your changes 
* Write tests for your changes
* Commit your changes (`git commit -m 'Made awesome improvements'`)
* Push to your branch (`git push origin improve-feature`)
* Create a pull request

#### Opening an issue  

If you find a bug, please open an issue [here](https://github.com/buildit/twig/issues). Please include the expected behavior, actual behavior, and 
detailed steps to reproduce the bug.

### Tools

* [Angular 4](https://angular.io/)
* [D3](https://d3js.org/)
* [Karma](https://karma-runner.github.io/1.0/index.html)
* [Protractor](http://www.protractortest.org/#/)

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.22-1 and updated to use the latest 1.0.0.

### Team

[@spotted-dog](https://github.com/spotted-dog)

[@aochsner](https://github.com/aochsner)

[@lizziesz](https://github.com/lizziesz)

[@BenAychh](https://github.com/BenAychh)

[@mathomas](https://github.com/mathomas)

### License 

See the [LICENSE](LICENSE.md) file for license rights and limitations (Apache 2.0).

### Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
