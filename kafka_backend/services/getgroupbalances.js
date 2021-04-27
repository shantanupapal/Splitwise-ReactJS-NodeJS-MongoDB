"use strict";
const Expense = require("../models/expenses");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const mongoose = require("mongoose");

let handle_request = async (message, callback) => {
    console.log("Inside Kafka : getgroupbalances");
    console.log("For Group: ", message);
    // return callback(null, "done");

    Expense.aggregate(
        [
            {
                $match: {
                    group_id: mongoose.Types.ObjectId(message.group_id),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "payer",
                    foreignField: "_id",
                    as: "payers",
                },
            },
            {
                $project: {
                    amount: 1,
                    payer: 1,
                    "payers.name": 1,
                    liables: 1,
                },
            },
        ],
        (err, result) => {
            if (err) {
                console.log("Unable to fetch expenses ", err);
                let err = {};
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                return callback(err, null);
            } else {
                if (result) {
                    console.log("Groupbalances ", result);
                    return callback(null, result);
                } else {
                    console.log("No Group balances");
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
