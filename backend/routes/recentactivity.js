const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.post("/", (req, res) => {
    console.log(req.body);
    const user_id = parseInt(req.body.user_id);
    const activities = [];
    const dates = [];
    // console.log("Group_id: ", group_id);
    pool.query(
        "SELECT distinctrow e.date,DATE_FORMAT(date, '%dth %M, %Y') AS fullDate, e.group_id, g.groupname, e.paid_by, e.liable,e.total_amount,e.amount, e.description, u.name AS payer, t.name AS borrower FROM splitwise.expenses e JOIN splitwise.groups g ON e.group_id = g.group_id JOIN splitwise.users u ON e.paid_by=u.user_id JOIN splitwise.users t ON e.liable=t.user_id WHERE e.paid_by = ? OR e.liable = ? group by date",
        [user_id, user_id],
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
                // res.status(200).send(JSON.stringify(result));
            }
            if (result.length > 0) {
                console.log(result);
                result.forEach((activity) => {
                    if (user_id === activity.paid_by) {
                        activities.push([
                            activity.fullDate,
                            activity.groupname,
                            activity.description,
                            activity.total_amount,
                            activity.amount,
                            "payer",
                            activity.payer,
                        ]);
                    } else if (user_id === activity.liable) {
                        activities.push([
                            activity.fullDate,
                            activity.groupname,
                            activity.description,
                            activity.total_amount,
                            activity.amount,
                            "borrower",
                            activity.payer,
                        ]);
                    }
                });
                res.status(200).send(JSON.stringify(activities));
            }
        }
    );
});

module.exports = router;
