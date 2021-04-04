const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.post("/", (req, res) => {
    const group_id = parseInt(req.body.group_id);
    // console.log("Group_id: ", group_id);
    pool.query(
        "SELECT distinct date, DATE_FORMAT(date, '%dth %M, %Y') AS fullDate, description, paid_by, total_amount, u.name FROM splitwise.expenses e JOIN splitwise.users u ON e.paid_by = u.user_id WHERE group_id = ? ORDER BY date DESC",
        [group_id],
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
                res.status(200).send(JSON.stringify(result));
            }
            if (result.length > 0) {
                // console.log(result);
                res.status(200).send(JSON.stringify(result));
            }
        }
    );
});

module.exports = router;
