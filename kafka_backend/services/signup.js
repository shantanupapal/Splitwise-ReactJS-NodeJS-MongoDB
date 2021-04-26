"use strict";
const User = require("../models/users");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
var bcrypt = require("bcrypt");
// var mongooseTypes = require("mongoose").Types;

let handle_request = async (message, callback) => {
    console.log("Inside Kafka Backend Signup");
    console.log("Message: ", message);

    let response = {};

    const saltRounds = 10;

    User.findOne(
        {
            email: message.email,
        },
        (err, user) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                return callback(err, null);
            } else {
                if (user) {
                    let err = {};
                    console.log("User Exists!", user);
                    err.status = STATUS_CODE.BAD_REQUEST;
                    err.data = MESSAGES.USER_ALREADY_EXISTS;
                    return callback(err, null);
                } else {
                    //Hashing Password!
                    bcrypt.hash(message.password, saltRounds, (err, hash) => {
                        if (err) {
                            console.log(err);
                        }
                        var user = new User({
                            name: message.name,
                            password: hash,
                            email: message.email,
                            phone: "",
                            profilephoto: "defaultProfilePhoto.png",
                            currency: "INR (₹)",
                            timezone:
                                "(GMT-08:00) Pacific Time (US&amp; Canada)",
                            language: "English",
                        });

                        user.save().then(
                            (doc) => {
                                console.log("User saved successfully.", doc);
                                response.status = STATUS_CODE.SUCCESS;
                                response.data = doc._id;
                                return callback(null, response);
                                // return callback(null, doc);
                            },
                            (err) => {
                                console.log(
                                    "Unable to save user details.",
                                    err
                                );
                                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                                return callback(err, null);
                            }
                        );
                    });
                }
            }
        }
    );
};

exports.handle_request = handle_request;
