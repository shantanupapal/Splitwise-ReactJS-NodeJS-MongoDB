const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.post("/", (req, res) => {
    // console.log("NEW Group details");
    // console.log(req.body);
    const members_id_to_add = req.body.members;
    const groupname = req.body.groupname;
    const creator_id = req.body.creator_id;
    let invitation_accepted = 0;
    let group_id;

    // console.log(typeof members_id_to_add);
    // console.log(typeof groupname);
    // console.log(typeof creator_id);

    // let all_members = members_id_to_add;
    // all_members.push(creator_id);
    // const entriesTo_one_to_one = () => {
    //     //Check if pair already exists
    //     //if length = 0{}
    //     //else {}
    //     const query_one_to_one =
    //         "INSERT INTO splitwise.one_to_one (user1_id, user2_id, amount, settled) VALUES ?";
    //     const one_to_one_entries = [];
    //     for (let i = 0; i < members_id_to_add.length; i++) {
    //         for (let j = 0; j < members_id_to_add.length; j++) {
    //             if (members_id_to_add[i] !== members_id_to_add[j]) {
    //                 one_to_one_entries.push([
    //                     members_id_to_add[i],
    //                     members_id_to_add[j],
    //                     0,
    //                     1,
    //                 ]);
    //             }
    //         }
    //     }

    //     console.log(one_to_one_entries);

    //     pool.query(query_one_to_one, [one_to_one_entries], (err, result) => {
    //         if (err) {
    //             console.log("error: ", err);
    //         } else {
    //             console.log("Added to one_to_one");
    //         }
    //     });
    // };

    const values = [];
    var count_of_groups_table;
    // values.push(gid, creator_id);
    pool.query(
        "SELECT COUNT(group_id) as 'count_of_groups' FROM splitwise.groups",
        (err, result) => {
            if (err) {
                console.log("Error: ", err);
            } else {
                count_of_groups_table = result[0].count_of_groups;
                console.log(count_of_groups_table);
                if (count_of_groups_table === 0) {
                    group_id = 1;
                    members_id_to_add.forEach((member_id) => {
                        const new_member_details = [];
                        if (creator_id === member_id) {
                            invitation_accepted = 1;
                            new_member_details.push(
                                group_id,
                                member_id,
                                groupname,
                                creator_id,
                                invitation_accepted
                            );
                        } else {
                            invitation_accepted = 0;
                            new_member_details.push(
                                group_id,
                                member_id,
                                groupname,
                                creator_id,
                                invitation_accepted
                            );
                        }

                        values.push(new_member_details);
                    });

                    const query =
                        "INSERT INTO splitwise.groups (group_id,user_id,groupname,creator_id,invitation_accepted) VALUES ?";

                    pool.query(query, [values], (err, result) => {
                        if (err) {
                            console.log("error: ", err);
                        } else {
                            console.log(
                                "total rows inserted: ",
                                result.affectedRows
                            );
                            //ADD to one_to_one
                            // entriesTo_one_to_one();
                        }
                    });
                } else {
                    pool.query(
                        "SELECT group_id FROM splitwise.groups ORDER BY group_id DESC LIMIT 1",
                        (err, result) => {
                            if (err) {
                                console.log("Error: ", err);
                            }

                            if (result.length === 0) {
                                console.log("No group found");
                            }
                            if (result.length > 0) {
                                group_id = result[0].group_id + 1;
                                members_id_to_add.forEach((member_id) => {
                                    const new_member_details = [];
                                    if (creator_id === member_id) {
                                        invitation_accepted = 1;
                                        new_member_details.push(
                                            group_id,
                                            member_id,
                                            groupname,
                                            creator_id,
                                            invitation_accepted
                                        );
                                    } else {
                                        invitation_accepted = 0;
                                        new_member_details.push(
                                            group_id,
                                            member_id,
                                            groupname,
                                            creator_id,
                                            invitation_accepted
                                        );
                                    }

                                    values.push(new_member_details);
                                });

                                const query =
                                    "INSERT INTO splitwise.groups (group_id,user_id,groupname,creator_id,invitation_accepted) VALUES ?";

                                pool.query(query, [values], (err, result) => {
                                    if (err) {
                                        console.log("error: ", err);
                                    } else {
                                        console.log(
                                            "total rows inserted: ",
                                            result.affectedRows
                                        );

                                        // entriesTo_one_to_one();
                                        res.status(200).end(
                                            "Group created successfully"
                                        );
                                    }
                                });
                            }
                        }
                    );
                }
            }
        }
    );

    // if (count_of_groups_table === 0) {
    //     group_id = 1;
    // members_id_to_add.forEach((member_id) => {
    //     const new_member_details = [];
    //     if (creator_id === member_id) {
    //         invitation_accepted = 1;
    //         new_member_details.push(
    //             group_id,
    //             member_id,
    //             groupname,
    //             creator_id,
    //             invitation_accepted
    //         );
    //     } else {
    //         invitation_accepted = 0;
    //         new_member_details.push(
    //             group_id,
    //             member_id,
    //             groupname,
    //             creator_id,
    //             invitation_accepted
    //         );
    //     }

    //     values.push(new_member_details);
    // });
    // const query =
    //     "INSERT INTO splitwise.groups (group_id,user_id,groupname,creator_id,invitation_accepted) VALUES ?";

    // pool.query(query, [values], (err, result) => {
    //     if (err) {
    //         console.log("error: ", err);
    //     } else {
    //         console.log("total rows inserted: ", result.affectedRows);
    //     }
    // });
    // } else {
    //     pool.query(
    //         "SELECT group_id FROM splitwise.groups ORDER BY group_id DESC LIMIT 1",
    //         (err, result) => {
    //             if (err) {
    //                 console.log("Error: ", err);
    //             }

    //             if (result.length === 0) {
    //                 console.log("No group found");
    //             }
    //             if (result.length > 0) {
    //                 group_id = result[0].group_id + 1;
    //             }
    //         }
    //     );
    // members_id_to_add.forEach((member_id) => {
    //     const new_member_details = [];
    //     if (creator_id === member_id) {
    //         invitation_accepted = 1;
    //         new_member_details.push(
    //             group_id,
    //             member_id,
    //             groupname,
    //             creator_id,
    //             invitation_accepted
    //         );
    //     } else {
    //         invitation_accepted = 0;
    //         new_member_details.push(
    //             group_id,
    //             member_id,
    //             groupname,
    //             creator_id,
    //             invitation_accepted
    //         );
    //     }

    //     values.push(new_member_details);
    // });

    // const query =
    //     "INSERT INTO splitwise.groups (group_id,user_id,groupname,creator_id,invitation_accepted) VALUES ?";

    // pool.query(query, [values], (err, result) => {
    //     if (err) {
    //         console.log("error: ", err);
    //     } else {
    //         console.log("total rows inserted: ", result.affectedRows);
    //     }
    // });
    // }

    // members_id_to_add.forEach((member_id) => {
    //     const new_member_details = [];
    //     if (creator_id === member_id) {
    //         invitation_accepted = 1;
    //         new_member_details.push(
    //             group_id,
    //             member_id,
    //             groupname,
    //             creator_id,
    //             invitation_accepted
    //         );
    //     } else {
    //         invitation_accepted = 0;
    //         new_member_details.push(
    //             group_id,
    //             member_id,
    //             groupname,
    //             creator_id,
    //             invitation_accepted
    //         );
    //     }

    //     values.push(new_member_details);
    // });

    // const query =
    //     "INSERT INTO splitwise.groups (group_id,user_id,groupname,creator_id,invitation_accepted) VALUES ?";

    // pool.query(query, [values], (err, result) => {
    //     if (err) {
    //         console.log("error: ", err);
    //     } else {
    //         console.log("total rows inserted: ", result.affectedRows);
    //     }
    // });

    // pool.query(
    //     "SELECT group_id FROM splitwise.groups ORDER BY group_id DESC LIMIT 1",
    //     (err, result) => {
    //         if (err) {
    //             console.log("Error: ", err);
    //         }

    //         if (result.length === 0) {
    //             console.log("No group found");
    //         }
    //         if (result.length > 0) {
    //             console.log("got it");
    //             console.log(typeof result);
    //             console.log(result[0].group_id);
    //             // res.status(200).send(JSON.stringify(result));
    //         }
    //     }
    // );

    // members_id_to_add.forEach((member_id) => {
    //     const new_member_details = [];
    //     if (creator_id === member_id) {
    //         invitation_accepted = 1;
    //         new_member_details.push(
    //             group_id,
    //             member_id,
    //             groupname,
    //             creator_id,
    //             invitation_accepted
    //         );
    //     } else {
    //         invitation_accepted = 0;
    //         new_member_details.push(
    //             group_id,
    //             member_id,
    //             groupname,
    //             creator_id,
    //             invitation_accepted
    //         );
    //     }

    //     values.push(new_member_details);
    // });

    // console.log(values);
    // pool.query("SELECT COUNT(*) FROM groups", (err, result) => {
    //     if (err) {
    //         console.log("Error: ", err);
    //         // res.writeHead(500, {
    //         //     "Content-Type": "text/plain",
    //         // });
    //         // res.send("Database Error");

    //         // res.send({ err: err });
    //     } else {
    //         console.log("COunt: ", result);
    //     }
    // });

    // try {
    //     pool.query(
    //         "SELECT group_id FROM groups ORDER BY group_id DESC LIMIT 1",
    //         (err, result) => {
    //             if (err) {
    //                 console.log("Error: ", err);
    //                 // res.writeHead(500, {
    //                 //     "Content-Type": "text/plain",
    //                 // });
    //                 // res.send("Database Error");

    //                 // res.send({ err: err });
    //             }

    //             if (result.length === 0) {
    //                 console.log("No group found");
    //             }
    //             if (result.length > 0) {
    //                 console.log("got it");
    //                 console.log(typeof result);
    //                 // res.status(200).send(JSON.stringify(result));
    //             }
    //         }
    //     );
    // } catch (err) {
    //     console.log("error: " + err);
    // }
    // const query =
    //     "INSERT INTO splitwise.groups (group_id,user_id,groupname,creator_id,invitation_accepted) VALUES ?";

    // pool.query(query, [values], (err, result) => {
    //     if (err) {
    //         console.log("error: ", err);
    //     } else {
    //         console.log("total rows inserted: ", result.affectedRows);
    //     }
    // });
});

module.exports = router;
