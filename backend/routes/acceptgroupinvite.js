const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");

//NewGroup
router.post("/", (req, res) => {
    console.log("Inside Accept group POST");
    console.log("Request Body: ", req.body);

    kafka.make_request("acceptgroupinvite", req.body, function (err, result) {
        console.log("In results accept group");
        console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            return res.status(err.status).send(err.data);
        } else if (result.status === 200) {
            console.log("Invitation accept successfully.");
            return res.status(result.status).send(result.data);
        }
    });
});

module.exports = router;
