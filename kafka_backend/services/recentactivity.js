"use strict";
const Expense = require("../models/expenses");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const mongoose = require("mongoose");

let handle_request = async (message, callback) => {
    console.log("Inside Kafka : Recent Activity");
    console.log("For User: ", message.user_id);
    Expense.aggregate(
        [
            {
                $match: {
                    $or: [
                        { payer: mongoose.Types.ObjectId(message.user_id) },
                        {
                            "liables._id": mongoose.Types.ObjectId(
                                message.user_id
                            ),
                        },
                    ],
                },
            },
            { $sort: { createdAt: 1 } },
            {
                $project: {
                    amount: 1,
                    group_id: 1,
                    description: 1,
                    payer: 1,
                    liables: 1,
                    createdAt: 1,
                },
            },
        ],
        (err, result) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                let err = {};
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                return callback(err, null);
            } else {
                if (result) {
                    console.log("Recent Activities ", result);
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
