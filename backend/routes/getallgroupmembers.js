const express = require("express");
const router = express.Router();
const Group = require("../models/groups");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const mongoose = require("mongoose");
const { checkAuth } = require("../utils/passport");

router.post("/", checkAuth, (req, res) => {
    const group_id = req.body.group_id;
    console.log("Group_id: ", group_id);

    Group.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.body.group_id),
                    "members.invitation_accepted": true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "members._id",
                    foreignField: "_id",
                    as: "names",
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
                    "names._id": 1,
                    "names.name": 1,
                },
            },
        ],
        (err, result) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                let err = {};
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                return res.status(err.status).send(err.data);
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
                    return res.status(err.status).send(err.data);
                }
            }
        }
    );
});

module.exports = router;
