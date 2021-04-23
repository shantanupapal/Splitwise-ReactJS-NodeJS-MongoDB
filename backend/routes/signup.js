const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");
var jwt = require("jsonwebtoken");
const { secret } = require("../utils/config");
const { auth } = require("../utils/passport");
auth();

//Signup
router.post("/", (req, res) => {
    console.log("Inside Signup POST");
    console.log("Request Body: ", req.body);

    kafka.make_request("signup", req.body, function (err, result) {
        console.log("In results Signup");
        console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            return res.status(err.status).send(err.data);
        } else if (result.status === 200) {
            console.log("User saved successfully.");

            // Create token if the password matched and no error was thrown
            // var token = jwt.sign(result, secret, {
            //     expiresIn: 10080, // in seconds
            // });

            let userDetails = {
                user_id: result.data,
                name: req.body.name,
                email: req.body.email,
                phone: "",
                profilephoto: "defaultProfilePhoto.png",
                currency: "INR (₹)",
                timezone: "(GMT-08:00) Pacific Time (US&amp; Canada)",
                language: "English",
                token: token,
            };
            // console.log("Result from db");
            // console.log(result);
            res.cookie("cookie", req.body.name, {
                maxAge: 900000,
                httpOnly: false,
                path: "/",
            });
            req.session.user = result;
            // Create token if the password matched and no error was thrown
            var token = jwt.sign(userDetails, secret, {
                expiresIn: 10080, // in seconds
            });

            console.log("token, ", token);

            return res.status(STATUS_CODE.SUCCESS).end("JWT " + token);
        }
    });
});

// router.post("/", (req, res) => {
//     const name = req.body.name;
//     const password = req.body.password;
//     const email = req.body.email;
//     // console.log("Request for SignUp");
//     // console.log(req.body);

//     const profilephoto = "defaultProfilePhoto.png";
//     const currency = "INR (₹)";
//     const language = "English";
//     const timezone = "(GMT-08:00) Pacific Time (US&amp; Canada)";
//     const phone = "";

//     const saltRounds = 10;

//     bcrypt.hash(password, saltRounds, (err, hash) => {
//         if (err) {
//             console.log(err);
//         }
//         pool.query(
//             "INSERT INTO users (name,email,password,profilephoto,currency,timezone,language,phone) VALUES (?,?,?,?,?,?,?,?)",
//             [
//                 name,
//                 email,
//                 hash,
//                 profilephoto,
//                 currency,
//                 timezone,
//                 language,
//                 phone,
//             ],
//             (err, result) => {
//                 if (err) {
//                     console.log(err);
//                     res.writeHead(404, {
//                         "Content-Type": "text/plain",
//                     });
//                     res.end("Email already exist. Please enter another email");
//                 } else {
//                     let userDetails = {
//                         name: name,
//                         email: email,
//                         phone: phone,
//                         currency: currency,
//                         timezone: timezone,
//                         language: language,
//                         profilephoto: profilephoto,
//                     };
//                     // console.log("Result from db");
//                     // console.log(result);
//                     res.cookie("cookie", name, {
//                         maxAge: 900000,
//                         httpOnly: false,
//                         path: "/",
//                     });
//                     req.session.user = result;
//                     // console.log(req.session.user);
//                     res.status(200).send(JSON.stringify(userDetails));
//                 }
//             }
//         );
//     });
// });

module.exports = router;
