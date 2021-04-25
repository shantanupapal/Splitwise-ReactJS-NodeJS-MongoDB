const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
const mongoose = require("mongoose");
const User = require("../models/users");
const { checkAuth } = require("../utils/passport");
//AddExpense
router.post("/", checkAuth, (req, res) => {
    console.log("Inside Dashboard Details GET");
    console.log("For user: ", req.body);
    const user = req.body.user_id;

    kafka.make_request("dashboarddetails", req.body, function (err, results) {
        console.log("In results Dashboard Details");
        // console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            return res.status(err.status).send(err.data);
        } else if (results.length === 0) {
            console.log("D-Details empty", results);
            return res
                .status(STATUS_CODE.NOT_SUCCESS)
                .send(MESSAGES.DATA_NOT_FOUND);
        } else {
            console.log("D-Details", results);
            const get_names = [];
            const they_owe = [];
            const i_owe = [];
            const dashboard_details = {};
            results.forEach((result) => {
                if (result.user_1 === user && result.amount !== 0) {
                    they_owe.push([result.user_2, result.amount]);
                    get_names.push(mongoose.Types.ObjectId(result.user_2));
                } else if (result.user_2 === user && result.amount !== 0) {
                    i_owe.push([result.user_1, result.amount]);
                    get_names.push(mongoose.Types.ObjectId(result.user_1));
                }
            });

            User.find(
                {
                    _id: { $in: get_names },
                },
                { name: 1 },
                (err, names) => {
                    if (err) {
                        console.log("Error to get names: ", err);
                    } else {
                        console.log("Names: ", names);
                        (they_owe_final = []), (i_owe_final = []);
                        names.forEach((person) => {
                            String(person._id);
                            they_owe.forEach((ower) => {
                                if (person._id == ower[0]) {
                                    console.log("is equal");
                                    // ower["name"] = name.name;
                                    they_owe_final.push([
                                        ower[0],
                                        ower[1],
                                        person.name,
                                    ]);
                                    // ower[2] = person.name;
                                }
                            });
                        });

                        names.forEach((person) => {
                            String(person._id);
                            i_owe.forEach((ower) => {
                                if (person._id == ower[0]) {
                                    console.log("is equal");
                                    // ower["name"] = name.name;
                                    i_owe_final.push([
                                        ower[0],
                                        ower[1],
                                        person.name,
                                    ]);
                                    // ower[2] = person.name;
                                }
                            });
                        });
                        const dashboard_details = {
                            they_owe: they_owe_final,
                            i_owe: i_owe_final,
                        };
                        console.log("TO SEND: ", dashboard_details);
                        return res
                            .status(STATUS_CODE.SUCCESS)
                            .send(dashboard_details);
                    }
                }
            ).then(() => {});
        }
    });
});

module.exports = router;
