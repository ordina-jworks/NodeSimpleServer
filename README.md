# NodeSimpleServer

[![Build Status](https://travis-ci.org/ordina-jworks/NodeSimpleServer.svg?branch=master)](https://travis-ci.org/ordina-jworks/NodeSimpleServer)

Simple node server application for hosting web content and web services.

This is a work in progress, not there may be bugs and incomplete features! 
Found a bug? Fixed a bug? Open an issue or make a pull request!

This is a simple NodeJS server application that allows you to host web pages and services.
The server application is written in TypeScript.


**Setup and run**
=================

**Running the application is simple:**

- Clone the repo to a local folder on your machine
- Make sure you have at least node 6.X.X installed
- On OSX/Linux make sure your npm permissions are fixed!
  - https://docs.npmjs.com/getting-started/fixing-npm-permissions
- Open a terminal or command window and go to the root folder of the project
- Execute the command: `npm install`
- Execute the command: `npm start`
- Open a browser and go to: `http://localhost:7080/`
- You should now see the web page with a big NodeJS logo

**Running with Docker:**
- Make sure you have Docker installed
- Go to the root folder of the project
- Execute the following command: `docker build -t node-simple-server .`
- Then run the newly created docker image by executing the following command: `docker run -p 7080:7080 -d -it node-simple-server`
- For now docker will always pull the latest files from the master branch. Change this to meet your needs!

**Some useful endpoints:**

- `http://localhost:7080/endpoints`
  - This lists all the registered endpoints with parameters and descriptions.
- `http://localhost:7080/helloworld/?name=test`
  - This is a demo endpoint that prints a welcome message with the given name.

**Application architecture**
============================
The architecture of the application is described below. It has been divided into categories for easier reading.


**Main application components:**
--------------------------------
The application is made to be multi-core aware. The base application starts a number of workers.
These workers are all in charge of set of specific tasks.

- `HTTPWorker`:
  - Handles HTTP requests
  - Serves content
  - Handles service endpoints
- `IntervalWorker`:
  - Executes code periodically
  - Enables Arduino communication
- `DataBroker`:
  - Stores data and provides basic data storing and retrieving functionality
  - Provide a web socket server to distribute data to remote (web)clients
  
Each worker is ran on its own node process. There is always one `IntervalWorker` and one `DataBroker`.
There are always at least two `HTPPWorker` instances. This number increases as there are more hardware threads available.
The separate node processes do not directly share memory but can communicate via IPC messaging.

Web content is served from the `www` folder. All file types are supported. Images have an extra caching header set to ease strain on the HTTPWorkers.
Services or Endpoints can easily be added. The EndPointManager singleton can be retrieved an be used to add new Endpoints to the application.
It is possible to change endpoints at runtime, any change made to the registered endpoints is reflected immediately and will be used for all following
HTTP Requests.

**Multiple workers: IPC**
-------------------------
Since all NodeJS processes (in this case the master and worker processes) have isolated memory they cannot execute methods on each other's context.
The IPC 'framework' provided in this application allows messages to be sent between workers. A worker should handle messages and allow for (some)
of its methods to be executed.

Messages can be replied to with a reply message. That will inform the caller that the callee has processed the message. The reply can also contain new data.
A reply is always sent back to the original worker otherwise problems would arise with the execution of the callback methods. This only applies to the HTTPWorkers 
as there are always multiple workers of this type.

For more information please consult the documentation in the classes for IPC communication under the /ipc/messages/ package.

**Arduino/Raspberry Pi logic**
------------------------------
An Arduino can be controlled in two ways in the application:
- Johnny-five robotics framework
- Regular Serial communication

Working with 'Arduino' logic on a Raspberry Pi:
- Supported by creating a johnny-five based scenario
- The Johnny-five framework should auto detect the device (unless you connect Arduino's on the raspberry pi!)

While each method has it advantages and disadvantages it is up to the developer to choose which method he uses.
Both methods extend a base Arduino class that provides basic functionality and should allow for easier code portability.

The Arduino implementations rely on a `Scenario` to be provided that contains the actual logic to interact with the Arduino.
The Arduino implementations itself are merely an adapter to provide communication. The Scenario provides the actual logic.

There are two example Scenarios. One for Johnny-Five (The `BlinkScenario`) and one for regular Serial (The `PingScenario`),
consult these examples when making new Scenarios.

**Blogpost about this application**
-----------------------------------
I've written a blogpost that features this application. You can find a lot more information about the architeture of the application in my blogpost
[Read my blogpost](https://ordina-jworks.github.io/iot/2017/01/21/Node-with-TypeScript.html) on the JWorks Tech Blog!

**Functionality to be implemented:**
====================================
- Implement decent custom logger
- Implement Web socket
- Port over slotmachine and booze-o-meter
- Set up testing