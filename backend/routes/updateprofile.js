const express = require("express");
const router = express.Router();
var passport = require("passport");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
var requireAuth = passport.authenticate("jwt", { session: false });

router.post("/", function (req, res) {
    console.log("Inside Update Profile POST!");
    console.log("Request Body: ", req.body);

    // if (req.session.user) {
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
});

module.exports = router;