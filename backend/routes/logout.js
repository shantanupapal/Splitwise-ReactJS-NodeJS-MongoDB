const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
    if (!req.session.user) {
        res.writeHead(404, {
            "Content-Type": "text/plain",
        });
        // res.end(result);
        res.end("Please login!");
    } else {
        req.session.destroy();
        res.writeHead(200, {
            "Content-Type": "text/plain",
        });
        // res.end(result);
        res.end("Logout Successful");
        //res.redirect("/");
    }
});

module.exports = router;
