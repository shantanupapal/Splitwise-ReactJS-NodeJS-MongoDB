"use strict";
const User = require("../models/users");
const bcrypt = require("bcrypt");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");

let handle_request = async (message, callback) => {
    console.log("Inside  Kafka Backend Login");
    console.log("Message", message);

    let response = {};
    User.findOne(
        {
            email: message.email,
        },
        (err, user) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                let err = {};
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                return callback(err, null);
            } else {
                if (user) {
                    console.log("User details ", user);
                    bcrypt.compare(
                        message.password,
                        user.password,
                        (err, response) => {
                            if (response) {
                                console.log(response);
                                return callback(null, user);
                            } else if (err) {
                                console.log("Error: ", err);
                                let err = {};
                                err.status = STATUS_CODE.BAD_REQUEST;
                                err.data = MESSAGES.INVALID_INPUTS;
                                return callback(err, null);
                            } else {
                                let err = {};
                                err.status = STATUS_CODE.NOT_SUCCESS;
                                err.data = MESSAGES.USER_NOT_EXIST;
                                console.log("Incorrect Password");
                                return callback(err, null);
                            }
                        }
                    );
                } else {
                    let err = {};
                    err.status = STATUS_CODE.NOT_SUCCESS;
                    err.data = MESSAGES.USER_NOT_EXIST;
                    console.log("Incorrect Username");
                    return callback(err, null);
                }
            }
        }
    );
};

exports.handle_request = handle_request;
