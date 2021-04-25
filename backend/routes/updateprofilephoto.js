const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
// const pool = require("../pool");
const multer = require("multer");
const upload = multer();
// const fs = require("fs");
// const { promisify } = require("util");
// const pipeline = promisify(require("stream").pipeline);
const app = require("../app");
const { uploadFile } = require("../config/s3");
const kafka = require("../kafka/client");
router.post(
    "/",
    upload.single("profilephoto"),
    async function (req, res, next) {
        if (req.files) {
            console.log("In Photoupload");
            const profilephoto = req.files.profilephoto;
            let filename = req.files.profilephoto.name;
            filename = user_id_photochange + ".jpg";
            req.files.profilephoto.name = filename;
            req.files.profilephoto.tempFilePath = "public/" + filename;
            // user_id = parseInt(user_id_photochange);

            // console.log("int");
            // console.log(user_id);

            // user_id_photochange = "abc";
            // console.log(user_id_photochange);
            console.log(filename);

            profilephoto.mv("public/" + filename);
            console.log("File OBject: ", req.files);
            // const result = await uploadFile(req.files.profilephoto);
            // console.log("result: ", result);

            reqBody = {
                user_id: user_id_photochange,
                filename: filename,
            };

            kafka.make_request("updateprofilephoto", reqBody, (err, result) => {
                console.log("In results accept group");
                console.log("Results: ", result);
                if (err) {
                    console.log("Error", err);
                    return res.status(err.status).send(err.data);
                } else if (result.status === 200) {
                    console.log("Invitation accept successfully.");
                    res.status(200).send(JSON.stringify(filename));
                }
            });

            // if (result) {
            //     //UPLOAD FILENAME TO DB USING KAFKA

            // }
        }
    }
);

module.exports = router;
