const express = require("express");
const router = express.Router();

const app = require("../app");

router.post("/", (req, res) => {
    const user_id = req.body.user_id;
    user_id_photochange = user_id;
    // console.log(user_id);
    // console.log(user_id_photochange);
    res.status(200).end("userId changed");
});

module.exports = router;
