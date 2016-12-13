# NodeSimpleServer

[![Build Status](https://travis-ci.org/ordina-jworks/NodeSimpleServer.svg?branch=master)](https://travis-ci.org/ordina-jworks/NodeSimpleServer)

Simple node server application for hosting web content and web services.

This is a work in progress, not there may be bugs and incomplete features! 
Found a bug? Fixed a bug? Open an issue or make a pull request!

This is a simple NodeJS server application that allows you to host web pages and services.
The server application is written in TypeScript.


**Setup and run**
=================

**Running the application is simple.**

- Clone the repo to a local folder on your machine
- Make sure you have at least node 6.X.X installed
- On OSX/Linux make sure your npm permissions are fixed!
  - https://docs.npmjs.com/getting-started/fixing-npm-permissions
- Open a terminal or command window and go to the root folder of the project
- Execute the command: 'npm install'
- Execute the command: 'npm start'
- Open a browser and go to: http://localhost:7080/
- You should now see the web page with a big nodejs logo


**Application architecture**
============================
The architecture of the application is described below. It has been deviced into categories for easier reading.


**Main application components:**
--------------------------------
The application is made to be multi-core aware. The base application starts a number of workers.
These workers are all in charge of set of specific tasks.

- HTTPWorker:
  - Handles HTTP requests
  - Serves content
  - Handles service endpoints
- IntervalWorker:
  - Executes code periodically
  - Enables Arduino communication
- DataBroker:
  - Stores data and provides basic data storing and retrieving functionality
  - Provide a websocket server to distribute data to remote (web)clients
  
Each worker is ran on its own node process. There is always one IntervalWorker and one DataBroker.
There are always at least two HTPPWorker instances. This number increases as there are more hardware threads available.
The separate node processes do not directly share memory but can communicate via IPC messaging.

Web content is served from the www folder. All file types are supported. Images have an extra caching header set to ease strain on the HTTPWorkers.
Services or Endpoints can easily be added. The EndPointManager singleton can be retrieved an be used to add new Endpoints to the application.
It is possible to change endpoints at runtime, any change made to the registered endpoints is reflected immediately and will be used for all following
HTTP Requests.

**Multiple workers: IPC**
-------------------------
TODO:

**Arduino logic**
-----------------
An Arduino can be controlled in two ways in the application:
- Johnny-five robotics framework
- Regular Serial communication

While each method has it advantages and disadvantages it is up to the developer to choose which method he uses.
Both methods extend a base Arduino class that provides basic functionality and should allow for easier code portability.


**Functionality to be implemented:**
====================================
- Implement databroker functionality
- Implement decent custom logger
- Implement Websockets 
- Set up testing