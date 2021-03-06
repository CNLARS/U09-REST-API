'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const { sequelize } = require("./db/models/index");
const courses = require('./routes/courses');
const users = require('./routes/users');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup JSON parsing:
app.use(express.json());
// setup morgan which gives us http request logging
app.use(morgan('dev'));

//cookie parser: 
//+Study Reference: https://expressjs.com/en/guide/writing-middleware.html
app.use(cookieParser());

//Authentication to the db:
(async () => {
  try{
    await sequelize.authenticate();
    console.log("db status: Successful Connection!");
  } catch (error){
    if(error.name === "SequelizeValidationError"){
      const errors = error.errors.map(err => err.message);
      console.error("Validation errors: ", errors);
    } else {
      throw error;
    }
  }
})();

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// setup for api routes
app.use('/api', courses);
app.use('/api', users);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});