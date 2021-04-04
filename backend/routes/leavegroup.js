const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.post("/", (req, res) => {
    const group_id = parseInt(req.body.group_id);
    const user_id = parseInt(req.body.user_id);
    // console.log("Group_id: ", group_id);
    pool.query(
        "DELETE FROM splitwise.groups WHERE group_id = ? AND user_id = ?",
        [group_id, user_id],
        (err, result) => {
            if (err) {
                console.log("Error: ", err);
                res.writeHead(500, {
                    "Content-Type": "text/plain",
                });
                res.send("Database Error");

                // res.send({ err: err });
            } else {
                res.status(200).end("Group left successfully");
            }
        }
    );
});

module.exports = router;
