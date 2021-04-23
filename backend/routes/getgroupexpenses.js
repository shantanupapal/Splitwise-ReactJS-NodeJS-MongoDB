const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
const { checkAuth } = require("../utils/passport");

getDateFormat = (dateString) => {
    const date = new Date(dateString);
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const month_digit = date.getMonth();
    const month = months[month_digit];
    const day = date.getDate();
    const year = date.getFullYear();
    return day + " " + month + ", " + year;
};
//GetGroupExpense
router.post("/", checkAuth, (req, res) => {
    console.log("Inside Group Expense GET");
    console.log("For: ", req.body);

    kafka.make_request("getgroupexpenses", req.body, function (err, result) {
        console.log("In results Group Expense");

        if (err) {
            console.log("Error", err);
            return res.status(err.status).send(err.data);
        } else if (result) {
            const expenses = [];
            console.log("Group Expenses fetch successful: ", result);
            result.forEach((expense) => {
                const date = getDateFormat(expense.createdAt);
                expenses.push([
                    date,
                    expense.description,
                    expense.payers[0].name,
                    expense.amount,
                    expense._id,
                    expense.comments,
                ]);
                // console.log("Payers: ", payer.payers[0]);
            });

            console.log("All expense: ", expenses);

            return res.status(STATUS_CODE.SUCCESS).send(expenses);
        }
    });
});

module.exports = router;
