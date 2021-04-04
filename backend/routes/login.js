const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../pool");

router.post("/", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // console.log(email);
    // console.log(password);

    pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, result) => {
            // console.log("Result", result);
            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain",
                });
                res.send("Database Error");
                // res.send({ err: err });
            }
            if (result.length > 0) {
                bcrypt.compare(
                    password,
                    result[0].password,
                    (error, response) => {
                        if (response) {
                            res.cookie("cookie", result[0].name, {
                                maxAge: 90000000,
                                httpOnly: false,
                                path: "/",
                            });
                            // console.log("RESULT: ", result);
                            req.session.user = result;
                            let userDetails = {
                                user_id: result[0].user_id,
                                name: result[0].name,
                                email: result[0].email,
                                phone: result[0].phone,
                                currency: result[0].currency,
                                timezone: result[0].timezone,
                                language: result[0].language,
                                profilephoto: result[0].profilephoto,
                            };
                            // console.log(userDetails);
                            res.status(200).send(JSON.stringify(userDetails));

                            // res.send(result, { message: "Successful Login" });
                            // res.writeHead(200, {
                            //     "Content-Type": "text/plain",
                            // });

                            // res.end("Successful Login");
                        } else {
                            res.writeHead(201, {
                                "Content-Type": "text/plain",
                            });
                            res.end("Wrong credentials");
                            // res.status(201).res.send(null, {
                            //     message: "Wrong credentials",
                            // });
                        }
                    }
                );
            } else {
                res.writeHead(404, {
                    "Content-Type": "text/plain",
                });
                res.end("No user found");
                // res.status(404).send({ message: "No user found" });
            }
        }
    );
});

module.exports = router;
// module.exports.router;
