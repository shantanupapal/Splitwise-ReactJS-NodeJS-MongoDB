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

    liables.forEach((liable) => {
        one_to_one.findOne(
            { $and: [{ user_1: message.payer }, { user_2: liable }] },
            (err, result) => {
                if (err) {
                    console.log("Error : ", err);
                } else {
                    if (result) {
                        // if entry found
                        console.log("Result: ", result);

                        (result.user_1 = message.payer),
                            (result.user_2 = liable),
                            (result.amount = result.amount + share),
                            result.save().then(
                                (doc) => {
                                    console.log(
                                        "Expense updated successfully.",
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
                        console.log("NULL");
                        const entry = new one_to_one({
                            user_1: message.payer,
                            user_2: liable,
                            amount: share,
                        });

                        entry.save().then(
                            (doc) => {
                                console.log("Expense added successfully.", doc);
                                // response.status = STATUS_CODE.SUCCESS;
                                // response.data = MESSAGES.SUCCESS;
                                // return callback(null, response);
                                // return callback(null, doc);
                            },
                            (err) => {
                                console.log("Unable to add expense", err);
                                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                                // return callback(err, null);
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


// get all group members 
Group.aggregate(
    [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.body.group_id),
                "members.invitation_accepted": true,
            },
        },
        {
            $project: {
                members: {
                    $filter: {
                        input: "$members",
                        as: "member",
                        cond: {
                            $eq: ["$$member.invitation_accepted", true],
                        },
                    },
                },
            },
        },
    ],


    db.getCollection('expenses').aggregate([{$match : {$or : [{_id : ObjectId("606dc54894d6200994323365")},{"liables._id": ObjectId("606dc54894d6200994323365")}]}},
{$sort : {createdAt:-1}}])