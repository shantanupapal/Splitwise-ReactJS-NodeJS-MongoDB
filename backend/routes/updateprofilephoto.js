const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../pool");
const multer = require("multer");
const upload = multer();
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const app = require("../app");

router.post("/", upload.single("profilephoto"), function (req, res, next) {
    if (req.files) {
        // console.log("id: ", user_id_photochange);
        // const {
        //     profilephoto,
        //     body: { name },
        // } = req;
        const profilephoto = req.files.profilephoto;
        let filename = req.files.profilephoto.name;
        filename = user_id_photochange + ".jpg";
        user_id = parseInt(user_id_photochange);
        // console.log("int");
        // console.log(user_id);

        // user_id_photochange = "abc";
        // console.log(user_id_photochange);
        // console.log(filename);

        profilephoto.mv("public/" + filename);

        pool.query(
            "UPDATE users SET profilephoto = ? WHERE user_id = ?",
            [filename, user_id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.writeHead(404, {
                        "Content-Type": "text/plain",
                    });
                    res.end("Error in updating profile photo");
                } else {
                    res.status(200).send(JSON.stringify(filename));
                }
            }
        );
    }
});

module.exports = router;
