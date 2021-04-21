"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const expenseSchema = new schema(
    {
        amount: {
            type: Number,
        },
        group_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "group",
        },
        description: {
            type: String,
        },
        payer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        liables: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user",
                },
                share: {
                    type: Number,
                },
            },
        ],
        comments: [
            {
                content: {
                    type: String,
                },
                by: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user",
                },
                created_at: {
                    type: Date,
                },
            },
        ],
    },
    { timestamps: true, versionKey: false }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
