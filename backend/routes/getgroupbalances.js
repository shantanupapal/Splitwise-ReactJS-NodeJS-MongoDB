const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
const { checkAuth } = require("../utils/passport");
const Group = require("../models/groups");
const mongoose = require("mongoose");
const User = require("../models/users");

//GroupBalances
router.post("/", checkAuth, async (req, res) => {
    console.log("Inside GetgroupBalances");
    console.log("Request Body: ", req.body);
    const group_members = [];
    const get_names = [];
    await Group.findOne(
        { _id: mongoose.Types.ObjectId(req.body.group_id) },
        { members: 1 },
        (err, result) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                let err = {};
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                console.log(err.data);
            } else {
                if (result) {
                    // console.log("All members ", result);
                    result.members.forEach((member) => {
                        group_members.push([String(member._id), 0]);
                        get_names.push(mongoose.Types.ObjectId(member._id));
                    });
                } else {
                    let err = {};
                    err.status = STATUS_CODE.NOT_SUCCESS;
                    err.data = MESSAGES.USER_NOT_EXIST;
                    console.log(err.data);
                }
            }
        }
    );

    await User.find(
        {
            _id: { $in: get_names },
        },
        { name: 1 },
        (err, names) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                let err = {};
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                console.log(err.data);
            } else {
                if (names) {
                    // console.log("Names ", names);
                    names.forEach((member_name) => {
                        group_members.forEach((member) => {
                            if (member[0] === String(member_name._id)) {
                                member.push(member_name.name);
                            }
                        });
                    });
                } else {
                    let err = {};
                    err.status = STATUS_CODE.NOT_SUCCESS;
                    err.data = MESSAGES.USER_NOT_EXIST;
                    console.log(err.data);
                }
            }
        }
    );

    console.log("GroupMemebrs:", group_members);

    kafka.make_request("getgroupbalances", req.body, function (err, result) {
        console.log("In results Group balances");
        // console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            return res.status(err.status).send(err.data);
        } else if (result) {
            // console.log("Groupbalances.", result);
            result.forEach((expense) => {
                group_members.forEach((member) => {
                    if (member[0] === expense.payer) {
                        member[1] =
                            member[1] +
                            expense.amount / (expense.liables.length + 1);
                    }
                });
                expense.liables.forEach((liable) => {
                    group_members.forEach((member) => {
                        if (member[0] === liable._id) {
                            member[1] = member[1] - liable.share;
                        }
                    });
                });
            });

            // console.log("fibal GB", group_members);
            return res.status(200).send(group_members);
        }
    });
    // console.log("");
});

module.exports = router;
