"use strict";
const Group = require("../models/groups");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
var bcrypt = require("bcrypt");
// var mongooseTypes = require("mongoose").Types;

let handle_request = async (message, callback) => {
    console.log("Inside Kafka Backend new group");
    console.log("Message: ", message);

    let response = {};

    Group.findOne(
        {
            groupname: message.name,
        },
        (err, group) => {
            if (err) {
                console.log("Unable to fetch group details.", err);
                return callback(err, null);
            } else {
                if (group) {
                    let err = {};
                    console.log("Group Exists!", group);
                    err.status = STATUS_CODE.BAD_REQUEST;
                    err.data = MESSAGES.USER_ALREADY_EXISTS;
                    return callback(err, null);
                } else {
                    const members_to_add = [];
                    message.members.forEach((member) => {
                        if (member !== message.creator_id) {
                            const member_details = {
                                _id: member,
                                invitation_accepted: 0,
                            };
                            members_to_add.push(member_details);
                        } else {
                            const member_details = {
                                _id: member,
                                invitation_accepted: 1,
                            };
                            members_to_add.push(member_details);
                        }
                    });
                    const group = new Group({
                        groupname: message.groupname,
                        creator_id: message.creator_id,
                        members: members_to_add,
                    });

                    group.save().then(
                        (doc) => {
                            console.log("Group created successfully.", doc);
                            response.status = STATUS_CODE.SUCCESS;
                            response.data = MESSAGES.CREATE_SUCCESSFUL;
                            return callback(null, response);
                            // return callback(null, doc);
                        },
                        (err) => {
                            console.log("Unable to create group.", err);
                            err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                            err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                            return callback(err, null);
                        }
                    );
                }
            }
        }
    );
};

exports.handle_request = handle_request;
