"use strict";
const Group = require("../models/groups");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");

let handle_request = (message, callback) => {
    console.log("Inside Kafka Method accept-invite. Message ", message);

    Group.findOneAndUpdate(
        {
            _id: message.group_id,
            "members._id": message.user_id,
        },
        {
            $set: {
                "members.$.invitation_accepted": true,
            },
        },
        (err, result) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                let err = {};
                err.status = STATUS_CODE.BAD_REQUEST;
                err.data = MESSAGES.USER_NOT_EXIST;
                return callback(err, null);
            } else if (result) {
                console.log("Userdetails", result);
                let response = {};
                response.status = STATUS_CODE.SUCCESS;
                response.data = MESSAGES.UPDATE_SUCCESSFUL;
                return callback(null, response);
            }
        }
    );
};

exports.handle_request = handle_request;
