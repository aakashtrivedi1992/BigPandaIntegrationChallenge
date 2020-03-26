# BigPandaIntegrationChallenge
Big Panda Integration Challenge

This API Integration is run using NodeJS. If you have not installed it, you can download it here: https://nodejs.org/en/download/

First run "npm install" to download all the node_modules and libraries.
There are also a few other libraries that need to be installed. You can install them locally so it can be added to your dev-dependencies. (Even though the package.json file is already in this repository, I am still writing this information in case the user wanted to work on it on their own)
The other libraries to download are express, request, chai, chaihttp, and mocha. These are used for API calls and for testing purposes.
Install them using these commands in your terminal/command line:
npm install --save-dev chai
npm install --save-dev chai-http
npm install mocha --save-dev
npm install express --save
npm install request --save

Then, in your package.json file, add this to the "scripts" section:
"scripts": {
  "test": "mocha"
},


In order to run the program, just type in "npm test".


This program has an API file with all the API calls, a test file in the "test" folder, and a routes file.
