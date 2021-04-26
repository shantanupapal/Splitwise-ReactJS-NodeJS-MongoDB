"use strict";
const one_to_one = require("../models/one_to_one");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const mongoose = require("mongoose");

let handle_request = async (message, callback) => {
    console.log("Inside Kafka : DashboardDetails");
    console.log("For User: ", message.user_id);
    one_to_one.find(
        {
            $or: [
                { user_1: new mongoose.Types.ObjectId(message.user_id) },
                { user_2: new mongoose.Types.ObjectId(message.user_id) },
            ],
        },
        { user_1: 1, user_2: 1, amount: 1 },
        (err, result) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                let err = {};
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                return callback(err, null);
            } else {
                if (result) {
                    console.log("User group details ", result);
                    return callback(null, result);
                } else {
                    let err = {};
                    err.status = STATUS_CODE.NOT_SUCCESS;
                    err.data = MESSAGES.USER_NOT_EXIST;
                    return callback(err, null);
                }
            }
        }
    );
};

exports.handle_request = handle_request;
