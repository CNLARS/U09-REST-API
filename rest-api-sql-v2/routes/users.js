"use strict";

const express = require('express');
const authenticateUser = require('./middleware/authenticateUser');
const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const auth = require("basic-auth");
const router = express.Router();
const User = require("../db/models").User;

//Async handler for each route to run try/catch
    function asyncHandler(cb){
        return async(req, res, next) => {
            try {
                await cb(req, res, next)
        } catch (error){
                next(error);
            }
        }
    }

/* USER ROUTES */

//GET "/api/users", (200): Returns the currently authenticated user
router.get("/users", authenticateUser, asyncHandler( async(req, res) => {
    const user = await User.findByPk(req.currentUser.id); //req.currentUser;
        if(user){
            res.status(200).json({user});
            } else {
                res.status(400).end();
            }
}));

/* POST "/api/users", (201):
Creates a user, sets the Location header to "/", and returns no content */
router.post("/users",[
    check("firstName")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a "first name"'),
    check("lastName")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a "last name"'),
    check("emailAddress")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide a valid email")
      .isEmail()
      .withMessage("Please provide a valid email address"),
    check("password")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please include a secure password"),
  ], asyncHandler( async(req, res) => {

    const errors = validationResult(req);
        const user = await User.create(req.body); //model adds to db > previous array

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({errors: errorMessages});
            } else {
                // Hash password and add new user:
                    user.password = bcryptjs.hashSync(user.password);
                    res.status(201).location("/").end(); //updates location and status code
        }
}));

module.exports = router;