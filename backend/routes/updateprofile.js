const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../pool");
const multer = require("multer");
const upload = multer();
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

router.post("/", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const currency = req.body.currency;
    const timezone = req.body.timezone;
    const language = req.body.language;
    const user_id = req.body.user_id;
    // console.log(req.body);

    pool.query(
        "UPDATE users SET name = ?, email = ?, phone = ?, currency = ?, timezone = ?,language = ? WHERE user_id = ?",
        [name, email, phone, currency, timezone, language, user_id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.writeHead(404, {
                    "Content-Type": "text/plain",
                });
                res.end("Error in updating");
            } else {
                let userDetails = {
                    name: name,
                    email: email,
                    phone: phone,
                    currency: currency,
                    timezone: timezone,
                    language: language,
                };
                res.status(200).send(JSON.stringify(userDetails));
            }
        }
    );
});

module.exports = router;
