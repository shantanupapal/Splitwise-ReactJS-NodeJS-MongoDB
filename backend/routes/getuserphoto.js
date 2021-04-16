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
const { getFileStream } = require("../config/s3");
router.get("/:key", (req, res, next) => {
    console.log("key: ", req.params.key);
    const key = req.params.key;
    const readStream = getFileStream(key);
    console.log("readstream: ", readStream);

    readStream.pipe(res);
});

module.exports = router;
