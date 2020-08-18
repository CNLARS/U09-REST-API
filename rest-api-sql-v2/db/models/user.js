"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
    // id (Integer, primary key, auto-generated)
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    // firstName (String)
        firstName: {
            type: Sequelize.STRING,
        },
    // lastName (String)
        lastName: {
            type: Sequelize.STRING,
        },
    // emailAddress (String)
        emailAddress: {
            type: Sequelize.STRING,
        },
    // password (String)
        password: {
            type: Sequelize.STRING,
        },
    }, { sequelize } );

    User.associate = (models) => {
        /*Define a HasMany association between User and Course models
         (i.e. a "User" has many "Courses").*/

         User.hasMany(models.Course, {
            foreignKey: "userId",
              as: "endUser",
         });
    }

    return User;
}