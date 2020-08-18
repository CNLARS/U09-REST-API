"use strict";

const express = require('express');
// const Sequelize = require("sequelize");
const { validationResult } = require('express-validator');
const bcryptjs = require("bcryptjs");
const auth = require("basic-auth");
// const User = require("../db/models/index");

const authenticateUser = (req, res, next) => {
    let message = null;

// Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
  
    if (credentials) {
    // Retrieve the username from db
    // (i.e. the user's "key" from the Authorization header).
      const user = users.find(u => u.username === credentials.name);
  
      if (user) {
        // Using bcryptjs compare the user's password
        // (from the Authorization header) to the user's password
            const authenticated = bcryptjs
            .compareSync(credentials.pass, user.password);
  
        if (authenticated) {
        console.log(`Authentication successful for ${user}, username: ${user.emailAddress}`);
  
    /*Store the retrieved user to req for any middleware functions
    hereafter now have access to the user's information. */
          req.currentUser = user;
        } else {
          message = `Authentication failure for login: ${user.emailAddress}`;
        }
      } else {
        message = `User not found for user: ${credentials.name}`;
      }
    } else {
      message = 'Authorization header not found';
    }
  
// If user authentication = access denied:
    if (message) {
      console.warn(message);
      res.status(401).json({ message });
    } else {
    // In the event of "Successful Authentication":
        next();
        }
  };

module.exports = authenticateUser;