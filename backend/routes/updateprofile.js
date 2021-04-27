const express = require("express");
const router = express.Router();
var passport = require("passport");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
var requireAuth = passport.authenticate("jwt", { session: false });
const { checkAuth } = require("../utils/passport");
const User = require("../models/users");

router.post("/", checkAuth, (req, res) => {
    console.log("Inside Update Profile POST!");
    console.log("Request Body: ", req.body);

    User.findOne(
        {
            email: req.body.email,
        },
        (err, user) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                return res.status(err.status).send(err.data);
            } else if (user) {
                let err = {};
                console.log("User Exists!", user);
                err.status = STATUS_CODE.NOT_SUCCESS;
                err.data = MESSAGES.USER_ALREADY_EXISTS;
                return res.status(err.status).send(err.data);
            } else {
                kafka.make_request("updateprofile", req.body, (err, result) => {
                    if (err) {
                        console.log("Unable to save user details.", err);
                        return res.status(err.status).send(err.data);
                    } else {
                        console.log("User details saved successfully.", result);
                        let userDetails = {
                            // user_id: result._id,
                            name: result.name,
                            email: result.email,
                            phone: result.phone,
                            // profilephoto: result.profilephoto,
                            currency: result.currency,
                            timezone: result.timezone,
                            language: result.language,
                        };
                        return res
                            .status(STATUS_CODE.SUCCESS)
                            .send(JSON.stringify(userDetails));
                    }
                });
            }
        }
    );
    // if (req.session.user) {
});

module.exports = router;
