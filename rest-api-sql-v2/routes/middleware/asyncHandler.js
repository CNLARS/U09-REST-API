"use strict";
const express = require("express");

//Async handler to run try/catch on Middleware:
function asyncHandler(cb){
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
    } catch (err){
            next(err);
        }
    }
}

module.exports = asyncHandler;