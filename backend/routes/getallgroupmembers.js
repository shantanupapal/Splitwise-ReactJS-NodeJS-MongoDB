const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.post("/", (req, res) => {
    const group_id = parseInt(req.body.group_id);
    // console.log("Group_id: ", group_id);
    pool.query(
        "SELECT user_id FROM splitwise.groups WHERE group_id = ? AND invitation_accepted = ?",
        [group_id, 1],
        (err, result) => {
            if (err) {
                console.log("Error: ", err);
                res.writeHead(500, {
                    "Content-Type": "text/plain",
                });
                res.send("Database Error");

                // res.send({ err: err });
            }
            if (result.length === 0) {
                console.log("No users found");
            }
            if (result.length > 0) {
                // console.log(result);
                res.status(200).send(JSON.stringify(result));
            }
        }
    );
});

module.exports = router;
