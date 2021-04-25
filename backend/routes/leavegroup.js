const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
const { checkAuth } = require("../utils/passport");

//Leave Group
router.post("/", checkAuth, (req, res) => {
    console.log("Inside Leave group POST");
    console.log("Request Body: ", req.body);

    kafka.make_request("leavegroup", req.body, function (err, result) {
        console.log("In results leave group");
        console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            return res.status(err.status).send(err.data);
        } else if (result.status === 200) {
            console.log("Group Left successfully.");
            return res.status(result.status).send(result.data);
        }
    });
});

module.exports = router;
