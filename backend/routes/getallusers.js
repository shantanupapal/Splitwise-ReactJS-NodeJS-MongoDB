const express = require("express");
const router = express.Router();
// const pool = require("../pool");
const User = require("../models/users");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");

router.get("/", (req, res) => {
    User.find({}, { _id: 1, name: 1 }, (err, result) => {
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
    });
});

module.exports = router;
