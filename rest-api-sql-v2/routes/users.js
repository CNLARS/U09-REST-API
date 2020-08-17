"use strict";

const express = require('express');
// const Sequelize = require("sequelize");
const authenticateUser = require('./middleware/authenticateUser');
const { check } = require("express-validator");
const router = express.Router();
const User = require("../db/models").User;

const users = []; //Array to contain collection of user data


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
router.get("/users", authenticateUser, (req, res) => {
    const user = User.findByPk(req.currentUser.id); //req.currentUser; 
        res.json({
            name: `${user.firstName} ${user.lastName}`,
            username: user.emailAddress,
        });
});

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
        const user = await User.create(req.body);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({errors: errorMessages});
            } else {
                // Hash password and add new user:
                    user.password = bcryptjs.hashSync(user.password);
                    users.push(user);
                    res.status(201).end();
        }
}));

module.exports = router;