const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
var jwt = require("jsonwebtoken");
const { secret } = require("../utils/config");
const { auth } = require("../utils/passport");
auth();

//Signup
router.post("/", (req, res) => {
    console.log("Inside Signup POST");
    console.log("Request Body: ", req.body);

    kafka.make_request("signup", req.body, function (err, result) {
        console.log("In results Signup");
        console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            return res.status(err.status).send(err.data);
        } else if (result.status === 200) {
            console.log("User saved successfully.");

            let userDetails = {
                user_id: result.data,
                name: req.body.name,
                email: req.body.email,
                phone: "",
                profilephoto: "defaultProfilePhoto.png",
                currency: "INR (₹)",
                timezone: "(GMT-08:00) Pacific Time (US&amp; Canada)",
                language: "English",
                token: token,
            };
            // console.log("Result from db");
            // console.log(result);
            res.cookie("cookie", req.body.name, {
                maxAge: 900000,
                httpOnly: false,
                path: "/",
            });
            req.session.user = result;
            // Create token if the password matched and no error was thrown
            var token = jwt.sign(userDetails, secret, {
                expiresIn: 10080, // in seconds
            });

            console.log("token, ", token);

            return res.status(STATUS_CODE.SUCCESS).end("JWT " + token);
        }
    });
});

module.exports = router;
