const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.post("/", (req, res) => {
    const user_id = req.body.user_id;
    // console.log("User_Id : " + user_id);
    pool.query(
        "SELECT group_id,groupname,invitation_accepted FROM splitwise.groups WHERE user_id = ?",
        [user_id],
        (err, result) => {
            console.log("Result", result);
            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain",
                });
                // res.send("Database Error");
                // res.send({ err: err });
            }
            if (result.length > 0) {
                // console.log("Result[0]: ", result);
                res.status(200).send(JSON.stringify(result));
            }
        }
    );
    // console.log("Reached here");
    // pool.query("SELECT user_id,name FROM users", (err, result, fields) => {
    //     if (err) {
    //         console.log("Error: ", err);
    //         res.writeHead(500, {
    //             "Content-Type": "text/plain",
    //         });
    //         res.send("Database Error");

    //         // res.send({ err: err });
    //     }
    //     if (result.length === 0) {
    //         console.log("No users found");
    //     }
    //     if (result.length > 0) {
    //         console.log(typeof result);
    //         res.status(200).send(JSON.stringify(result));
    //     }
    // });
});

module.exports = router;
