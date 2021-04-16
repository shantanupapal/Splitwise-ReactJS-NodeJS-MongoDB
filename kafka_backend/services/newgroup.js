"use strict";
const Group = require("../models/groups");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
var bcrypt = require("bcrypt");
// var mongooseTypes = require("mongoose").Types;

let handle_request = async (message, callback) => {
    console.log("Inside Kafka Backend new group");
    console.log("Message: ", message);

    let response = {};

    // const saltRounds = 10;
    //User creation query

    // const profileId = mongooseTypes.ObjectId();

    //Check if group name exists

    Group.findOne(
        {
            name: message.name,
        },
        (err, group) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                return callback(err, null);
            } else {
                if (group) {
                    let err = {};
                    console.log("Group Exists!", group);
                    err.status = STATUS_CODE.BAD_REQUEST;
                    err.data = MESSAGES.USER_ALREADY_EXISTS;
                    return callback(err, null);
                } else {
                    var group = new Group({
                        name : message.name,
                        created_by : message.
                    })
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
// let handle_request = async (msg, callback) => {
//     let response = {};
//     let err = {};
//     try {
//         const user = await User.findOne({
//             email_id: msg.email_id
//         });
//         const userName = await User.findOne({
//             user_name: msg.user_name
//         });
//         if (user) {
//             err.status = STATUS_CODE.BAD_REQUEST;
//             err.data = MESSAGES.USER_ALREADY_EXISTS;
//             return callback(err, null);
//         } else if(userName){
//             err.status = STATUS_CODE.BAD_REQUEST;
//             err.data = MESSAGES.USER_NAME_ALREADY_EXISTS;
//             return callback(err, null);
//         }
//         else {
//             let user = new User({
//                 first_name: msg.first_name,
//                 last_name: msg.last_name,
//                 user_name: msg.user_name,
//                 email_id: msg.email_id
//             });
//             const usersave = await user.save();
//             if (usersave) {
//                 response.status = STATUS_CODE.SUCCESS;
//                 response.data = usersave._id;
//                 return callback(null, response);
//             } else {
//                 err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
//                 err.data = MESSAGES.INTERNAL_SERVER_ERROR;
//                 return callback(err, null);
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
//         err.data = MESSAGES.INTERNAL_SERVER_ERROR;
//         return callback(err, null);
//     }
// }

exports.handle_request = handle_request;
