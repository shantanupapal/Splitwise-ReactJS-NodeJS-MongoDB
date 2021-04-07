const express = require("express");
const router = express.Router();
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const kafka = require("../kafka/client");

//Signup
router.post("/", function (req, res) {
    console.log("Inside Signup POST");
    console.log("Request Body: ", req.body);
    // let msg = req.body;
    // if (error) {
    //     msg.error = error.details[0].message;
    //     return res
    //         .status(STATUS_CODE.BAD_REQUEST)
    //         .send(error.details[0].message);
    // }

    kafka.make_request("signup", req.body, function (err, result) {
        console.log("In results Signup");
        console.log("Results: ", result);
        if (err) {
            console.log("Error", err);
            return res.status(err.status).send(err.data);
        } else if (result.status === 200) {
            console.log("User saved successfully.");
            let userDetails = {
                user_id: result.data,
                name: req.body.name,
                email: req.body.email,
                phone: "",
                profilephoto: "defaultProfilePhoto.png",
                currency: "INR (₹)",
                timezone: "(GMT-08:00) Pacific Time (US&amp; Canada)",
                language: "English",
            };
            // console.log("Result from db");
            // console.log(result);
            res.cookie("cookie", req.body.name, {
                maxAge: 900000,
                httpOnly: false,
                path: "/",
            });
            req.session.user = result;
            // res.writeHead(200, {
            //     "Content-type": "text/plain",
            // });
            // res.end("Adding a user successful!");
            return res
                .status(STATUS_CODE.SUCCESS)
                .send(JSON.stringify(userDetails));
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
