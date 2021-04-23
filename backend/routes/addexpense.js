const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
const { checkAuth } = require("../utils/passport");

//AddExpense
router.post("/", checkAuth, (req, res) => {
    console.log("Inside Add Expense POST");
    console.log("Expense: ", req.body);

    kafka.make_request("addexpense", req.body, function (err, result) {
        console.log("In results Add Expense");
        console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            return res.status(err.status).send(err.data);
        } else if (result) {
            console.log("Expense added successfully.");
            return res.status(result.status).send(result.data);
        }
    });
});

module.exports = router;
