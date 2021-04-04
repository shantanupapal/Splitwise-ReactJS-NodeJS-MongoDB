const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../pool");

router.post("/", (req, res) => {
    const name = req.body.name;

    pool.query(
        "SELECT user_id FROM users WHERE name = ?",
        [name],
        (err, result) => {
            console.log("Result", result);
            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain",
                });
                res.send("Database Error");
                // res.send({ err: err });
            }
            if (result.length > 0) {
                // console.log("Result in getuserid", result);
                let user_id = result[0].user_id;
                // console.log("USER - ID: ", user_id);
                res.status(200).send(JSON.stringify(user_id));
            }
        }
    );
});

module.exports = router;
