const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
const { checkAuth } = require("../utils/passport");

//NewGroup
router.post("/", checkAuth, (req, res) => {
    console.log("Inside NewGroup POST");
    console.log("Request Body: ", req.body);

    kafka.make_request("newgroup", req.body, function (err, result) {
        console.log("In results New Group");
        console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            return res.status(err.status).send(err.data);
        } else if (result.status === 200) {
            console.log("Group created successfully.");
            return res.status(STATUS_CODE.SUCCESS).send(res.data);
        } else if (result.status === 201) {
            return res
                .status(STATUS_CODE.NOT_SUCCESS)
                .send(MESSAGES.USER_ALREADY_EXISTS);
        }
    });
});

module.exports = router;
