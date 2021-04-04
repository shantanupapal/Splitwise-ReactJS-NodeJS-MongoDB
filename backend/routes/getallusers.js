const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.get("/", (req, res) => {
    // console.log("Reached here");
    pool.query("SELECT user_id,name FROM users", (err, result) => {
        if (err) {
            // console.log("Error: ", err);
            res.writeHead(500, {
                "Content-Type": "text/plain",
            });
            res.end("Database Error");

            // res.send({ err: err });
        }
        // if (result.length === 0) {
        //     // console.log("No users found");
        // }
        if (result) {
            // console.log(typeof result);
            res.status(200).end();
        }
    });
});

module.exports = router;
