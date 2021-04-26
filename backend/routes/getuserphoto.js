const express = require("express");
const router = express.Router();

const { getFileStream } = require("../config/s3");
router.get("/:key", (req, res, next) => {
    console.log("key: ", req.params.key);
    const key = req.params.key;
    const readStream = getFileStream(key);
    console.log("readstream: ", readStream);

    readStream.pipe(res);
});

module.exports = router;
