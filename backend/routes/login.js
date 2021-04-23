const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
var jwt = require("jsonwebtoken");
const { secret } = require("../utils/config");
const { auth } = require("../utils/passport");
auth();
//Login validation
router.post("/", (req, res) => {
    console.log("Inside login POST");
    console.log("Request Body: ", req.body);

    //Kafka request

    kafka.make_request("login", req.body, function (err, result) {
        console.log("In results login");
        console.log("results", result);
        if (err) {
            console.log("Error", err);
            return res.status(err.status).send(err.data);
        } else {
            console.log("Inside results Login");
            if (result) {
                res.cookie("cookie", req.body.name, {
                    maxAge: 900000,
                    httpOnly: false,
                    path: "/",
                });
                req.session.user = result;
                console.log("User: ", result);

                const userDetails = {
                    user_id: result._id,
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    profilephoto: result.profilephoto,
                    currency: result.currency,
                    timezone: result.timezone,
                    language: result.language,
                };

                // Create token if the password matched and no error was thrown
                var token = jwt.sign(userDetails, secret, {
                    expiresIn: 10080, // in seconds
                });
                console.log("token, ", token);
                return res.status(STATUS_CODE.SUCCESS).end("JWT " + token);
            }
        }
    });

    //Query
});

module.exports = router;
