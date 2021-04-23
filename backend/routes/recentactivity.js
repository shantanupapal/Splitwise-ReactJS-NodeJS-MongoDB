const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
const User = require("../models/users");
const Group = require("../models/groups");
const { checkAuth } = require("../utils/passport.js");
//RecentActivity
router.post("/", checkAuth, (req, res) => {
    console.log("Inside Recent Activity POST");
    console.log("Request Body: ", req.body);
    var got_names = 0;

    kafka.make_request("recentactivity", req.body, function (err, results) {
        // console.log("In results recent activity", results);
        //console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            // return res.status(err.status).send(err.data);
        } else if (results) {
            // console.log("Got RecentActivities.");
            const user_id = req.body.user_id;
            let get_names = [];
            let get_group_names = [];
            let allnames = [];
            let allgroupnames = [];
            const activities = [];

            results.forEach((activity) => {
                get_group_names.push(activity.group_id);
                get_names.push(activity.payer);
                // activity.liables.forEach((liable) => {
                //     get_names.push(liable._id);
                // });
            });

            get_names = [...new Set(get_names)];
            get_group_names = [...new Set(get_group_names)];

            User.find(
                { _id: { $in: get_names } },
                { _id: 1, name: 1 },
                (err, names) => {
                    if (err) {
                        console.log("Unable to fetch user details.", err);
                        let err = {};
                        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                        // return callback(err, null);
                    } else {
                        if (names) {
                            console.log("All names ", names);
                            allnames = names;
                            Group.find(
                                { _id: { $in: get_group_names } },
                                { _id: 1, groupname: 1 },
                                (err, groupnames) => {
                                    if (err) {
                                        console.log(
                                            "Unable to fetch user details.",
                                            err
                                        );
                                        let err = {};
                                        err.status =
                                            STATUS_CODE.INTERNAL_SERVER_ERROR;
                                        err.data =
                                            MESSAGES.INTERNAL_SERVER_ERROR;
                                        // return callback(err, null);
                                    } else {
                                        if (groupnames) {
                                            console.log(
                                                "All group names ",
                                                groupnames
                                            );
                                            allgroupnames = groupnames;
                                            got_names = 1;

                                            if (got_names === 1) {
                                                console.log("ifif");
                                                results.forEach((activity) => {
                                                    let groupname = "";
                                                    let name = "";
                                                    allgroupnames.forEach(
                                                        (group) => {
                                                            if (
                                                                String(
                                                                    group._id
                                                                ) ===
                                                                activity.group_id
                                                            ) {
                                                                groupname =
                                                                    group.groupname;
                                                            }
                                                        }
                                                    );
                                                    allnames.forEach(
                                                        (names) => {
                                                            if (
                                                                String(
                                                                    names._id
                                                                ) ===
                                                                activity.payer
                                                            ) {
                                                                name =
                                                                    names.name;
                                                            }
                                                        }
                                                    );

                                                    if (
                                                        user_id ===
                                                        activity.payer
                                                    ) {
                                                        let get_amount =
                                                            (activity.amount /
                                                                (activity
                                                                    .liables
                                                                    .length +
                                                                    1)) *
                                                            activity.liables
                                                                .length;
                                                        activities.push([
                                                            activity.createdAt,
                                                            groupname,
                                                            activity.description,
                                                            activity.amount,
                                                            get_amount,
                                                            "payer",
                                                            name,
                                                        ]);
                                                    } else {
                                                        let owe_amount =
                                                            activity.amount /
                                                            (activity.liables
                                                                .length +
                                                                1);
                                                        activities.push([
                                                            activity.createdAt,
                                                            groupname,
                                                            activity.description,
                                                            activity.amount,
                                                            owe_amount,
                                                            "borrower",
                                                            name,
                                                        ]);
                                                    }
                                                });
                                            }

                                            console.log(activities);
                                            return res
                                                .status(STATUS_CODE.SUCCESS)
                                                .send(activities);
                                        } else {
                                            let err = {};
                                            err.status =
                                                STATUS_CODE.NOT_SUCCESS;
                                            err.data = MESSAGES.USER_NOT_EXIST;
                                            return res
                                                .status(STATUS_CODE.SUCCESS)
                                                .send(MESSAGES.DATA_NOT_FOUND);
                                        }
                                    }
                                }
                            );
                            // return res
                            //     .status(STATUS_CODE.SUCCESS)
                            //     .send(JSON.stringify(names));
                        } else {
                            let err = {};
                            err.status = STATUS_CODE.NOT_SUCCESS;
                            err.data = MESSAGES.USER_NOT_EXIST;
                            // return callback(err, null);
                        }
                    }
                }
            );

            // return res.status(result.status).send(result.data);
        }
    });
});

module.exports = router;
