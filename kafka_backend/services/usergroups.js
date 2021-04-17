"use strict";
const Group = require("../models/groups");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");

let handle_request = async (message, callback) => {
    console.log("Inside Get User Groups");
    console.log("For User: ", message);
    Group.find(
        { "members._id": message.user_id },
        { groupname: 1, "members.invitation_accepted.$": 1 },
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
