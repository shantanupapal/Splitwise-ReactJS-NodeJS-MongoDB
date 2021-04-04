const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.post("/", (req, res) => {
    const user_id = req.body.user_id;
    const group_id = req.body.group_id;
    // console.log("User_Id : " + user_id);
    // console.log("group_id : " + group_id);

    pool.query(
        "UPDATE splitwise.groups SET invitation_accepted = ? WHERE group_id =? AND user_id = ?",
        [1, group_id, user_id],
        (err, result) => {
            // console.log("Result", result);
            if (err) {
                // console.log(err);
                res.writeHead(404, {
                    "Content-Type": "text/plain",
                });
                res.end("Error in updating");
            } else {
                // console.log("DONE");
                res.status(200).end("Updated");
            }
        }
    );
});

module.exports = router;
