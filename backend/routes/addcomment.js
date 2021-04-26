const express = require("express");
const router = express.Router();
const Expense = require("../models/expenses");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const mongoose = require("mongoose");
const { checkAuth } = require("../utils/passport");
const kafka = require("../kafka/client");

router.post("/", checkAuth, (req, res) => {
    console.log("Inside Add COmment POST");
    console.log("Request: ", req.body);

    kafka.make_request("addcomment", req.body, function (err, result) {
        console.log("In results Add Comment");
        console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            return res
                .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
                .send("Internal server error");
        } else if (result) {
            console.log("Comment added successfully.");
            return res
                .status(STATUS_CODE.SUCCESS)
                .send("Comment added successfully.");
        }
    });
});

module.exports = router;
