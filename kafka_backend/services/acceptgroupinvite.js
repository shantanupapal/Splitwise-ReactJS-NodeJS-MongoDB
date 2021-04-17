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
                return callback(null, result);

                // user.name = message.name;
                // user.language = message.language;
                // // user.email = message.body.email;
                // user.timezone = message.timezone;
                // user.currency = message.currency;
                // user.phone = message.phone;
                // // user.ProfileImage = message.body.ProfileImage;

                // user.save().then(
                //     (doc) => {
                //         console.log("User details saved successfully.", doc);
                //         // response.status = STATUS_CODE.SUCCESS;
                //         // response.data = doc._id;
                //         return callback(null, doc);
                //     },
                //     (err) => {
                //         console.log("Unable to save user details.", err);
                //         err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                //         err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                //         return callback(err, null);
                //     }
                // );
            }
        }
    );
};

exports.handle_request = handle_request;
