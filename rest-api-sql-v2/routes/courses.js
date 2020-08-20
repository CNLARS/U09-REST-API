"use strict";

const express = require('express');
const router = express.Router();
const { Course, User } = require("../db/models");
const authenticateUser = require('./middleware/authenticateUser');
const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const auth = require("basic-auth");

//Async handler for each route to run try/catch
function asyncHandler(cb){
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
    } catch (err){
            next(err);
        }
    }
}

/* COURSE ROUTES */

/* GET "/api/courses", (200): 
Returns list of courses (including the user by association) */
    //Study Reference: https://gist.github.com/zcaceres/83b554ee08726a734088d90d455bc566
router.get("/courses", asyncHandler( async(req, res) => {
    console.log("Testing321"); //Testing123
    const courses = await Course.findAll();
    // console.log(courses); //Testing123 
        if(courses){
            console.log("Testing123");
            res.json(courses);
            res.status(200).end();
        } else {
            res.status(404).end();
        }
}));

/* GET "/api/courses/:id", (200): 
Returns course (including the user that owns the course) for the provided course ID */
router.get("/courses/:id", asyncHandler( async(req, res) => {
    const course = await Course.findByPk(req.params.id);
        if(course){
            res.json({course});
            res.status(200).end();
        } else {
            res.status(404).end();
        }
}));

/* POST "/api/courses" (201): 
Creates a course, sets the Location header to the URI for the course, and returns no content */
router.post("/courses",[
    check("title")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please create a "title" for the course'),
    check("description")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please add a "description" for the course'),
    ], 
    authenticateUser, asyncHandler( async(req, res) => {
        const errors = validationResult(req);
        const course = req.body;

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(404).json({errors: errorMessages});
            } else {
                await Course.create(course); // async/await for course.id
                console.log(course);
                //Study Reference: https://www.geeksforgeeks.org/express-js-res-location-function/#:~:text=The%20res.,if%20you%20want%20to%20write.
                res.location(`/courses/${course.id}`);
                res.status(201).end();
        }    
}));

/* PUT "/api/courses/:id" (204): Updates a course and returns no content */
router.put("/courses/:id",[
    check("title")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Course requires a "title"'),
    check("description")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Course requires "description"'),
    ], authenticateUser, asyncHandler( async(req, res) => {

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({errors: errorMessages});
            } else {
                let course = await Course.findByPk(req.params.id);
                course.update(req.body);
                res.status(204).end();
            }    
}));

/* DELETE "/api/courses/:id" (204): Deletes a course and returns no content */
router.delete("/courses/:id", authenticateUser, asyncHandler( async(req, res) => {
    let course;
    try{
        course = await Course.findByPk(req.params.id);
        course.destroy();
            // console.log("Returning to Universe");
        res.status(204).end();
    } catch(error){ //In the unexpected event of an error?
        res.status(400).end();
    }
}));

module.exports = router;