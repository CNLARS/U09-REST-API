"use strict";

const express = require('express');
// const Sequelize = require("sequelize");
const authenticateUser = require('./middleware/authenticateUser');
const { check } = require("express-validator");
const router = express.Router();
const { Course, User } = require("../db/models");


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

/* COURSE ROUTES */

/* GET "/api/courses", (200): 
Returns list of courses (including the user by association) */

//Study Reference: https://gist.github.com/zcaceres/83b554ee08726a734088d90d455bc566
router.get("/courses", asyncHandler( async(req, res) => {
    const courses = await Course.findAll({
       include: [{
           model: User,
           as: "endUser"
       }]
    });
    console.log(courses); //Testing123 
        if(courses){
            res.json({courses});
            res.status(200).end();
        } else {
            res.status(404).end();
        }
}));

/* GET "/api/courses/:id", (200): 
Returns course (including the user that owns the course) for the provided course ID */

router.get("/courses/:id", asyncHandler( async(req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: [{
            model: User,
            as: "endUser"
        }]
    });
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
    check("estimatedTime")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please add an approx. "time" estimate for scheduling the course'),
    ], 
    authenticateUser, asyncHandler( async(req, res) => {
        const errors = validationResult(req);
        const course = req.body;

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(404).json({errors: errorMessages});
            } else {
                course = await Course.create(req.body); // async/await for course.id
                //Study Reference: https://www.geeksforgeeks.org/express-js-res-location-function/#:~:text=The%20res.,if%20you%20want%20to%20write.
                res.location(`/courses/${course.id}`);
                res.status(201).end();
        }
    // let course;
    // try{
    //     course = await Course.create(req.body); // async/await for course.id
    //     //Study Reference: https://www.geeksforgeeks.org/express-js-res-location-function/#:~:text=The%20res.,if%20you%20want%20to%20write.
    //     res.location(`/courses/${course.id}`);
    //     res.status(201).end();
    // } catch(error){
    //     if(error.name === "SequelizeValidationError"){
    //         course = await Course.create(req.body); //Keeps input data preserved
    //             //details each SequelizeValidationError:
    //             const errors = error.errors.map(err => err.message);
    //             console.error("Validation Error(s): ", errors);
    //         res.status(400).end();
    //     } else {
    //         throw error; //async to catch
    //     }
    // }
    
}));
/* PUT "/api/courses/:id" (204): Updates a course and returns no content */
router.put("/courses/:id",[
    check("title")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Course requires a "title"'),
    check("description")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Course requires "description"'),
    check("estimatedTime")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('"Rime" estimate needed for scheduling purposes'),
    ], authenticateUser, asyncHandler( async(req, res) => {

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({errors: errorMessages});
            } else {
                let course = Course.findByPk(req.params.id);
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
        res.status(204).end();
    } catch(error){ //In the unexpected event of an error?
        res.status(400).end();
        //throw error?
    }
}));

module.exports = router;