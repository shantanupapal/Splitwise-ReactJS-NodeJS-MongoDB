const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.post("/", (req, res) => {
    const group_id = parseInt(req.body.group_id);
    // console.log("Group_id: ", group_id);
    const payers = [];
    const borrowers = [];
    const all_balances = [];
    const all_names = [];
    pool.query(
        "SELECT u.name,paid_by, SUM(amount) AS amount FROM splitwise.expenses e JOIN splitwise.users u ON e.paid_by = u.user_id WHERE group_id=? group by paid_by ORDER BY paid_by;",
        [group_id],
        (err, payer_results) => {
            if (err) {
                console.log("Error: ", err);
                res.writeHead(500, {
                    "Content-Type": "text/plain",
                });
                res.send("Database Error");

                // res.send({ err: err });
            }
            // if (result.length === 0) {
            //     //check only for liables group
            // }
            if (payer_results.length >= 0) {
                // console.log("PAYERS: ", payer_results);
                payer_results.forEach((result) => {
                    payers.push([result.name, result.paid_by, result.amount]);
                });

                pool.query(
                    "SELECT u.name, liable, SUM(amount) AS amount FROM splitwise.expenses e JOIN splitwise.users u ON e.liable = u.user_id WHERE group_id=? group by liable ORDER BY liable;",
                    [group_id],
                    (err, results) => {
                        if (err) {
                            console.log("Error: ", err);
                            res.writeHead(500, {
                                "Content-Type": "text/plain",
                            });
                            res.send("Database Error");

                            // res.send({ err: err });
                        }
                        // if (result.length === 0) {
                        //     console.log("No users found");
                        // }
                        if (results.length >= 0) {
                            // console.log("BORROWERS: ", results);
                            results.forEach((result) => {
                                borrowers.push([
                                    result.name,
                                    result.liable,
                                    result.amount,
                                ]);
                            });
                            console.log("BORROWERS: ", borrowers);
                            console.log("PAYERS: ", payers);

                            payers.forEach((payer) => {
                                borrowers.forEach((borrower) => {
                                    if (payer[1] === borrower[1]) {
                                        console.log("FOUND");
                                        let balance = payer[2] - borrower[2];
                                        all_balances.push([
                                            payer[0],
                                            payer[1],
                                            balance,
                                        ]);
                                        all_names.push(payer[0]);
                                    }
                                });
                            });

                            payers.forEach((payer) => {
                                if (!all_names.includes(payer[0])) {
                                    console.log("Doesn't include: ", payer[0]);
                                    all_balances.push([
                                        payer[0],
                                        payer[1],
                                        payer[2],
                                    ]);
                                }
                            });

                            borrowers.forEach((borrower) => {
                                if (!all_names.includes(borrower[0])) {
                                    // console.log(
                                    //     "Doesn't include: ",
                                    //     borrower[0]
                                    // );
                                    all_balances.push([
                                        borrower[0],
                                        borrower[1],
                                        -borrower[2],
                                    ]);
                                }
                            });

                            console.log(all_balances);
                            res.status(200).send(all_balances);
                        }
                    }
                );
                // res.status(200).send(JSON.stringify(result));
            }
        }
    );
});

module.exports = router;
