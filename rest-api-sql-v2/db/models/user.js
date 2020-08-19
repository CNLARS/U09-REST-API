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
        //Refactored to feature Column declaration shorthand syntax:
        
    // firstName (String)
        firstName: Sequelize.STRING,
    // lastName (String)
        lastName: Sequelize.STRING,
    // emailAddress (String)
        emailAddress: Sequelize.STRING,
    // password (String)
        password: Sequelize.STRING,

    }, { sequelize } );

    User.associate = (models) => {
        /*Define a HasMany association between User and Course models
         (i.e. a "User" has many "Courses").*/

         User.hasMany(models.Course, {
            foreignKey: { 
                fieldName: "userId",
                allowNull: false,
            }
         });
    }

    return User;
}