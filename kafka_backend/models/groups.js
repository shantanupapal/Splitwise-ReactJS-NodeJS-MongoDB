"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const groupSchema = new schema(
    {
        name: {
            type: String,
            required: true,
        },
        created_by : {
            type: mongoose.Schema.Types.ObjectId,
             ref: "user" 
        },
        members : [
            {
                member_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "user",
				},
                member_name : {
                    type: String,
                    ref : "user"
                }
				invitation_accepted: { type: Boolean, default: 0 },
            }
        ]
        
    },
    { timestamps: true, versionKey: false }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
