"use strict";
const Expense = require("../models/expenses");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const mongoose = require("mongoose");

let handle_request = async (message, callback) => {
    const expense_id = message.expense_id;
    console.log("expense_id: ", message.comment_id);

    const comment = {
        content: message.comment,
        by: message.by,
        created_at: new Date(),
    };
    Expense.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(message.expense_id) },
        {
            $pull: {
                comments: { _id: mongoose.Types.ObjectId(message.comment_id) },
            },
        },
        (err, result) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                let err = {};
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                return callback(err, null);
            } else {
                if (result) {
                    console.log("Comment deleted ", result);
                    let response = {};
                    response.status = STATUS_CODE.SUCCESS;
                    response.data = MESSAGES.CREATE_SUCCESSFUL;
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
