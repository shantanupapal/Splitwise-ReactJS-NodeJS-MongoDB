const express = require("express");
const router = express.Router();
const Expense = require("../models/expenses");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const mongoose = require("mongoose");

router.post("/", (req, res) => {
    const expense_id = req.body.expense_id;
    console.log("Group_id: ", expense_id);

    const comment = {
        content: req.body.comment,
        by: req.body.by,
        created_at: new Date(),
    };
    Expense.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.expense_id) },
        {
            $push: { comments: comment },
        },
        (err, result) => {
            if (err) {
                console.log("Unable to fetch user details.", err);
                let err = {};
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                return res.status(err.status).send(err.data);
            } else {
                if (result) {
                    console.log("Comments ", result);

                    return res
                        .status(STATUS_CODE.SUCCESS)
                        .send(MESSAGES.SUCCESS);
                } else {
                    let err = {};
                    err.status = STATUS_CODE.NOT_SUCCESS;
                    err.data = MESSAGES.USER_NOT_EXIST;
                    return res.status(err.status).send(err.data);
                }
            }
        }
    );
});

module.exports = router;
