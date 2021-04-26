const express = require("express");
const router = express.Router();
const Expense = require("../models/expenses");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const mongoose = require("mongoose");
const { checkAuth } = require("../utils/passport");
const kafka = require("../kafka/client");

router.post("/", checkAuth, (req, res) => {
    console.log("Inside Delete Comment POST");
    console.log("Request: ", req.body);

    kafka.make_request("deletecomment", req.body, function (err, result) {
        console.log("In results Delete Comment");
        console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            return res
                .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
                .send(MESSAGES.INTERNAL_SERVER_ERROR);
        } else if (result) {
            console.log("Comment Deleted successfully.");
            return res.status(STATUS_CODE.SUCCESS).send(MESSAGES.SUCCESS);
        }
    });
});

module.exports = router;
