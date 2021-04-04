const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.post("/", (req, res) => {
    const user_id = req.body.user_id;
    const owers = req.body.owers;
    console.log("user to settle:", req.body);

    pool.query(
        "UPDATE splitwise.one_to_one SET amount = ?, settled = ? WHERE user2_id = ? OR (user1_id = ? AND user2_id IN (?))",
        [0, 1, user_id, user_id, owers],
        (err, result) => {
            if (err) {
                console.log(err);
                res.writeHead(404, {
                    "Content-Type": "text/plain",
                });
                res.end("Error in updating");
            } else {
                console.log("updated");
                res.status(200).end("Settled Up");
            }
        }
    );
});

module.exports = router;
