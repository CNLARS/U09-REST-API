"use strict";

const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
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
    const user =  req.currentUser; //User.findByPk(req.currentUser.id);
        res.json({
            name: `${user.firstName} ${user.lastName}`,
            username: user.emailAddress,
        });
});

/* POST "/api/users", (201):
Creates a user, sets the Location header to "/", and returns no content */
router.post("/users",[
    check("firstName")
      .exists()
      .withMessage('Please provide a "first name"'),
    check("lastName")
      .exists()
      .withMessage('Please provide a "last name"'),
    check("emailAddress")
      .exists()
      .withMessage("Please provide a valid email"),
    check("password")
      .exists()
      .withMessage("Please include a secure password"),
  ], asyncHandler( async(req, res) => {

    const errors = validationResult(req);
        const user = req.body;

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({errors: errorMessages});
            } else {
                // Hash password and add new user:
                    user.password = bcryptjs.hashSync(user.password);
                    users.push(user);
                    res.status(201).end();
        }
    //   let user;
    // try{
    //     user = req.body; //From input form
    //     user.password = bcryptjs.hashSync(user.password); //Hash PSW with bcrypt
    //     users.push(user); //Adding to Array of users
    //     res.status(201).end(); //End response and status code update
    // } catch(error){
    //     if(error.name === "SequelizeValidationError"){
    //         user = await req.body; //Keeps input data preserved
    //             //details each SequelizeValidationError:
    //             const errors = error.errors.map(err => err.message);
    //             console.error("Validation Error(s): ", errors);
    //         res.status(400).end();
    //     } else {
    //         throw error; //async to catch
    //     }
    // }
}));

module.exports = router;