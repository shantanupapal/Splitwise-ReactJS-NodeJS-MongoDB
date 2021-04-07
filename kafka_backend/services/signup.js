"use strict";
const User = require("../models/users");
// const { STATUS_CODE, MESSAGES } = require("../../utils/constants");
var bcrypt = require("bcrypt");
// var mongooseTypes = require("mongoose").Types;

function handle_request(message, callback) {
    console.log("Inside Kafka Backend Signup");
    console.log("Message: ", message);

    const saltRounds = 10;
    //User creation query

    // const profileId = mongooseTypes.ObjectId();

    //Check if user exists

    User.findOne(
        {
            email: message.email,
        },
        (err, user) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                callback(err, null);
            } else {
                if (user) {
                    console.log("User Exists!", user);
                    // if (message.Accounttype === user.Accounttype) {
                    //     console.log("Duplicate user");
                    //     callback(null, null);
                    // } else {
                    //     user.Accounttype = 3;
                    // }
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
                            phone: 9800,
                            profilephoto: "defaultProfilePhoto.png",
                            currency: "INR (₹)",
                            timezone:
                                "(GMT-08:00) Pacific Time (US&amp; Canada)",
                            language: "English",
                        });

                        user.save().then(
                            (doc) => {
                                console.log("User saved successfully.", doc);
                                callback(null, doc);
                            },
                            (err) => {
                                console.log(
                                    "Unable to save user details.",
                                    err
                                );
                                callback(err, null);
                            }
                        );
                    });
                }
            }
        }
    );
}
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
