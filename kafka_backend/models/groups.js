"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const groupSchema = new schema(
    {
        groupname: {
            type: String,
            required: true,
        },
        creator_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        members: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user",
                },
                invitation_accepted: {
                    type: Boolean,
                    default: 0,
                },
            },
        ],
    },
    { timestamps: true, versionKey: false }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
