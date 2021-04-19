"use strict";
const Expense = require("../models/expenses");
const one_to_one = require("../models/one_to_one");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
// var bcrypt = require("bcrypt");
// var mongooseTypes = require("mongoose").Types;

let handle_request = async (message, callback) => {
    console.log("Inside Kafka Backend Add Expense");
    console.log("Message: ", message);
    const total_members = message.liables.length;
    const share = message.amount / total_members;

    let response = {};
    const liables = [];
    message.liables.forEach((liable) => {
        if (liable !== message.payer) {
            liables.push({ _id: liable, share: share });
        }
    });

    //add to one_to_one
    // liables.forEach((liable) => {
    //     const one_to_one_entry = new one_to_one({
    //         user_1: message.payer,
    //         user_2: liable,
    //         amount: share,
    //     });

    //     one_to_one_entry.save().then(
    //         (doc) => {
    //             console.log("Expense added successfully to one_to_one.", doc);
    //             response.status = STATUS_CODE.SUCCESS;
    //             response.data = MESSAGES.SUCCESS;
    //             // return callback(null, response);
    //             // return callback(null, doc);
    //         },
    //         (err) => {
    //             console.log("Unable to add expense to one_to_one", err);
    //             err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
    //             err.data = MESSAGES.INTERNAL_SERVER_ERROR;
    //             // return callback(err, null);
    //         }
    //     );
    // });

    /**
     * Case 1 : If direct entry found
     */

    liables.forEach((liable) => {
        one_to_one.findOne(
            { $and: [{ user_1: message.payer }, { user_2: liable }] },
            (err, result) => {
                if (err) {
                    console.log("Error : ", err);
                } else {
                    if (result !== null) {
                        // if entry found
                        console.log("Case1, True -> Result:  ", result);

                        (result.user_1 = message.payer),
                            (result.user_2 = liable),
                            (result.amount = result.amount + share),
                            result.save().then(
                                (doc) => {
                                    console.log(
                                        "Case 1 : Expense updated successfully.",
                                        doc
                                    );
                                    // response.status = STATUS_CODE.SUCCESS;
                                    // response.data = MESSAGES.SUCCESS;
                                    // return callback(null, response);
                                    // return callback(null, doc);
                                },
                                (err) => {
                                    console.log("Unable to add expense", err);
                                    err.status =
                                        STATUS_CODE.INTERNAL_SERVER_ERROR;
                                    err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                                    // return callback(err, null);
                                }
                            );
                    } else {
                        one_to_one.findOne(
                            {
                                $and: [
                                    { user_1: liable },
                                    { user_2: message.payer },
                                ],
                            },
                            (err, result) => {
                                if (err) {
                                    console.log("Error : ", err);
                                } else if (result !== null) {
                                    // if entry found
                                    console.log(
                                        "Case 2 : True -> Result: ",
                                        result
                                    );

                                    (result.user_1 = liable),
                                        (result.user_2 = message.payer),
                                        (result.amount = result.amount - share),
                                        result.save().then(
                                            (doc) => {
                                                console.log(
                                                    "Case 2 : Expense updated successfully.",
                                                    doc
                                                );
                                                // response.status = STATUS_CODE.SUCCESS;
                                                // response.data = MESSAGES.SUCCESS;
                                                // return callback(null, response);
                                                // return callback(null, doc);
                                            },
                                            (err) => {
                                                console.log(
                                                    "Unable to add expense",
                                                    err
                                                );
                                                err.status =
                                                    STATUS_CODE.INTERNAL_SERVER_ERROR;
                                                err.data =
                                                    MESSAGES.INTERNAL_SERVER_ERROR;
                                                // return callback(err, null);
                                            }
                                        );
                                } else {
                                    console.log("Case 3 : NULL");
                                    const entry = new one_to_one({
                                        user_1: message.payer,
                                        user_2: liable,
                                        amount: share,
                                    });

                                    entry.save().then(
                                        (doc) => {
                                            console.log(
                                                "Case 3 : Entry made and expense added successfully.",
                                                doc
                                            );
                                            // response.status = STATUS_CODE.SUCCESS;
                                            // response.data = MESSAGES.SUCCESS;
                                            // return callback(null, response);
                                            // return callback(null, doc);
                                        },
                                        (err) => {
                                            console.log(
                                                "Unable to add expense",
                                                err
                                            );
                                            err.status =
                                                STATUS_CODE.INTERNAL_SERVER_ERROR;
                                            err.data =
                                                MESSAGES.INTERNAL_SERVER_ERROR;
                                            // return callback(err, null);
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    // const comments = [];
    // const today = new Date();
    // const comment = {
    //     content: "hello",
    //     by: message.payer,
    //     created_at: today,
    // };
    // comments.push(comment);

    //add to expense
    const expense = new Expense({
        amount: message.amount,
        group_id: message.group_id,
        description: message.description,
        payer: message.payer,
        liables: liables,
        // comments: comment,
    });

    console.log("Expense object: ", expense);
    // return callback(null, "gotit");

    expense.save().then(
        (doc) => {
            console.log("Expense added successfully.", doc);
            response.status = STATUS_CODE.SUCCESS;
            response.data = MESSAGES.SUCCESS;
            return callback(null, response);
            // return callback(null, doc);
        },
        (err) => {
            console.log("Unable to add expense", err);
            err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
            err.data = MESSAGES.INTERNAL_SERVER_ERROR;
            return callback(err, null);
        }
    );
};

exports.handle_request = handle_request;
