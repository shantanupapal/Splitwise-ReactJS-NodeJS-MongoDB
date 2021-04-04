"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const userSchema = new schema(
    {
        user_name: {
            type: String,
            // trim: true,
            unique: true,
            required: true,
        },
        email_id: {
            type: String,
            // trim: true,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            unique: true,
            required: true,
        },
        phone_number: {
            type: Number,
            // trim: true,
            unique: true,
            required: true,
        },
        currency: {
            type: String,
            // trim: true,
        },
        timezone: {
            type: String,
            // trim: true,
        },
        language: {
            type: String,
            // trim: true,
        },
        user_image: {
            type: String,
            // trim: true,
        },
    },
    { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
