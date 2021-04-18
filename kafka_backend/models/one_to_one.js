"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const one_to_oneSchema = new schema(
    {
        user_1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        user_2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        amount: {
            type: Number,
        },
    },
    { timestamps: true, versionKey: false }
);

const one_to_one = mongoose.model("one_to_one", one_to_oneSchema);

module.exports = one_to_one;
