const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");

//AddExpense
router.get("/", (req, res) => {
    console.log("Inside Dashboard Details GET");
    console.log("For user: ", req.body);

    kafka.make_request("dashboarddetails", req.body, function (err, result) {
        console.log("In results Dashboard Details");
        console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            // return res.status(err.status).send(err.data);
        } else if (result) {
            console.log("D-Details", result);
            // return res.status(result.status).send(result.data);
        }
    });
});

module.exports = router;
