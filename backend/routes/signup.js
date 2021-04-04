const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../pool");

router.post("/", (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    // console.log("Request for SignUp");
    // console.log(req.body);

    const profilephoto = "defaultProfilePhoto.png";
    const currency = "INR (₹)";
    const language = "English";
    const timezone = "(GMT-08:00) Pacific Time (US&amp; Canada)";
    const phone = "";

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }
        pool.query(
            "INSERT INTO users (name,email,password,profilephoto,currency,timezone,language,phone) VALUES (?,?,?,?,?,?,?,?)",
            [
                name,
                email,
                hash,
                profilephoto,
                currency,
                timezone,
                language,
                phone,
            ],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.writeHead(404, {
                        "Content-Type": "text/plain",
                    });
                    res.end("Email already exist. Please enter another email");
                } else {
                    let userDetails = {
                        name: name,
                        email: email,
                        phone: phone,
                        currency: currency,
                        timezone: timezone,
                        language: language,
                        profilephoto: profilephoto,
                    };
                    // console.log("Result from db");
                    // console.log(result);
                    res.cookie("cookie", name, {
                        maxAge: 900000,
                        httpOnly: false,
                        path: "/",
                    });
                    req.session.user = result;
                    // console.log(req.session.user);
                    res.status(200).send(JSON.stringify(userDetails));
                }
            }
        );
    });
});

module.exports = router;
