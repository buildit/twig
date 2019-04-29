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
  * [Development](#development)
  * [Build](#build)
  * [Unit Tests](#unit-tests)
  * [End-to-End Tests](#end-to-end-tests)
  * [API Documentation](#twig-api-documentation)
* [User Notes](#user-notes)
  * [How To Contribute](#how-to-contribute)
  * [Tools](#tools)
  * [Team](#team)
  * [License](#license)
  * [Further Help](#further-help)
* [Living Style Guide](https://buildit.github.io/twig/)

## Quick Start

Clone the [Twig API](https://github.com/buildit/twig-api) locally. From the twig-api root run a Docker command to
create the back-end.

```Shell
git clone git@github.com:buildit/twig-api.git
cd twig-api
docker-compose up

# Make sure to run `docker-compose down` to turn off the API when you're done
```

Clone this repo. Set the proper Node version ([Node Version Manager](https://github.com/creationix/nvm) is recommended). 
Navigate to the root and install the dependencies. Then run the app.

```Shell
nvm use
npm install
npm run serve
```

This builds the app and runs it on a dev server. Navigate to [localhost:4200](http://localhost:4200/). 
The app will automatically reload if you change any of the source files.

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

All Twig data is persisted in a [CouchDB](http://couchdb.apache.org/) instance.

## Demo

Click the link to watch an awesome demo of the basics of Twig:

[Video demo (Part 1)](https://youtu.be/q4LWoQUeRjc)

## Where is it deployed?

In the Buildit Riglet:

**Staging Environment**: [https://builditstaging-twig.buildit.tools/](https://builditstaging-twig.buildit.tools/) - must be connected to Buildit Tools VPN/VPC to Sign In 

**Production Environment**: [https://builditproduction-twig.buildit.tools/](https://builditproduction-twig.buildit.tools/)

## Getting Started

### Development

#### Logging In

Once you have set up Twig and Twig API, Twig is read only while logged out. On localhost, there are three ways to log in to Twig to start creating
twiglets, editing twiglets, etc.

1. If you are not logged in to the Buildit VPN, you can use the dummy user with email: local@user and password: password. Note that this login will only work locally, not on staging or production.
1. With your VPN credentials
1. Using your Mothership corporate email address

#### Linting

Twig uses linting rules as defined in tslint.json. By default all .ts files are linted.

#### Testing

Twig uses [Karma](https://karma-runner.github.io) to run unit tests. Want to make a change? Write a test. Write code until it passes. Make sure you didn't break any other tests.

Twig uses [Protractor](http://www.protractortest.org/) for end-to-end tests. End to end tests require that an instance of Twig API is running. Want to make a change? See the paragraph above for directions.

Prior to checking in code, be sure to run both unit and end-to-end tests following the instructions outlined below.

#### CI/CD

Twig CI/CD assumes the use of [Jenkins](https://jenkins.io/) Pipeline features (see [Jenkinsfile](Jenkinsfile)).

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Unit Tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### End-to-End Tests

Before running the tests make sure you are serving the app via `npm run serve` as well as Twig API.
Run `npm run test:e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Twig API Documentation

The Twig API is documented using Swagger. If running Twig API locally, navigate to [http://localhost:3000/documentation](http://localhost:3000/documentation) to view the documentation.

## User Notes

### How to Contribute

#### Opening an issue

If you find a bug, please open an issue [here](https://github.com/buildit/twig/issues). Please include the expected behavior, actual behavior, and detailed steps to reproduce the bug.

### Tools

* [Angular 4](https://angular.io/)
* [D3](https://d3js.org/)
* [Karma](https://karma-runner.github.io/1.0/index.html)
* [Protractor](http://www.protractortest.org/#/)

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.22-1 and updated to use the latest 1.0.0.

### Team

Hap Pearman ([@spotted-dog](https://github.com/spotted-dog))

Andy Ochsner ([@aochsner](https://github.com/aochsner))

Lizzie Szoke ([@lizziesz](https://github.com/lizziesz))

Ben Hernandez ([@BenAychh](https://github.com/BenAychh))

Mike Thomas ([@mathomas](https://github.com/mathomas))

Emily Burns ([@emjane])

Shahzain Badruddin

David Moss

Andrew Urmston

### License

See the [LICENSE](LICENSE.md) file for license rights and limitations (Apache 2.0).

### Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
