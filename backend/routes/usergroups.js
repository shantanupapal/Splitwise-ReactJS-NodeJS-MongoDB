const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
const { checkAuth } = require("../utils/passport");

router.post("/", checkAuth, (req, res) => {
    console.log("Inside Get User Groups");
    console.log("For User: ", req.body);

    kafka.make_request("usergroups", req.body, function (err, result) {
        console.log("In results usergroups");
        console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            return res.status(err.status).send(err.data);
        } else if (result) {
            console.log("Get groups successfull.");
            return res.status(STATUS_CODE.SUCCESS).send(JSON.stringify(result));
        }
    });
});

module.exports = router;
