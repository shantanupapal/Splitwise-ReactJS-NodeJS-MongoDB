const express = require("express");
const router = express.Router();
// const pool = require("../pool");
const one_to_one = require("../models/one_to_one");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const { checkAuth } = require("../utils/passport");
const mongoose = require("mongoose");
// ObjectId("606de88a94d6200994323367");
// ObjectId("606dc54894d6200994323365");
router.post("/", checkAuth, (req, res) => {
    const user = req.body.user_id;
    const owers = req.body.owers;

    console.log(user, owers);
    owers.forEach((ower) => {
        one_to_one.updateOne(
            {
                $or: [
                    {
                        $and: [
                            {
                                user_1: mongoose.Types.ObjectId(ower),
                            },
                            {
                                user_2: mongoose.Types.ObjectId(user),
                            },
                        ],
                    },
                    {
                        $and: [
                            {
                                user_1: mongoose.Types.ObjectId(user),
                            },
                            {
                                user_2: mongoose.Types.ObjectId(ower),
                            },
                        ],
                    },
                ],
            },
            { $set: { amount: 0 } },
            (err, result) => {
                if (err) {
                    console.log("Unable to fetch user details.", err);

                    return res
                        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
                        .send(MESSAGES.INTERNAL_SERVER_ERROR);
                } else {
                    if (result) {
                        console.log("All users details ", result);
                    } else {
                        return res
                            .status(STATUS_CODE.NOT_SUCCESS)
                            .send(MESSAGES.USER_NOT_EXIST);
                    }
                }
            }
        );
    });

    return res.status(STATUS_CODE.SUCCESS).send(MESSAGES.SUCCESS);
});

module.exports = router;
