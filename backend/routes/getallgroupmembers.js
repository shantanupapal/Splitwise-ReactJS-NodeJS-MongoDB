const express = require("express");
const router = express.Router();
const Group = require("../models/groups");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const mongoose = require("mongoose");

router.post("/", (req, res) => {
    const group_id = req.body.group_id;
    console.log("Group_id: ", group_id);

    Group.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(group_id),
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
        (err, result) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                let err = {};
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                return callback(err, null);
            } else {
                if (result) {
                    console.log("All users details ", result);

                    return res
                        .status(STATUS_CODE.SUCCESS)
                        .send(JSON.stringify(result));
                } else {
                    let err = {};
                    err.status = STATUS_CODE.NOT_SUCCESS;
                    err.data = MESSAGES.USER_NOT_EXIST;
                    return callback(err, null);
                }
            }
        }
    );

    // pool.query(
    //     "SELECT user_id FROM splitwise.groups WHERE group_id = ? AND invitation_accepted = ?",
    //     [group_id, 1],
    //     (err, result) => {
    //         if (err) {
    //             console.log("Error: ", err);
    //             res.writeHead(500, {
    //                 "Content-Type": "text/plain",
    //             });
    //             res.send("Database Error");

    //             // res.send({ err: err });
    //         }
    //         if (result.length === 0) {
    //             console.log("No users found");
    //         }
    //         if (result.length > 0) {
    //             // console.log(result);
    //             res.status(200).send(JSON.stringify(result));
    //         }
    //     }
    // );
});

module.exports = router;
