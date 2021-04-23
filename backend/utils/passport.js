"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
var { secret } = require("./config");
const User = require("../models/users");

// Setup work and export for the JWT passport strategy
function auth() {
    console.log("gothere");
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: secret,
    };
    passport.use(
        new JwtStrategy(opts, (jwt_payload, callback) => {
            const user_id = jwt_payload.user_id;
            console.log("jwt_payload: ", jwt_payload);
            console.log("usr_id: ", user_id);
            User.findById(user_id, (err, results) => {
                if (err) {
                    return callback(err, false);
                }
                if (results) {
                    callback(null, results);
                } else {
                    callback(null, false);
                }
            });
        })
    );
}

exports.auth = auth;
exports.checkAuth = passport.authenticate("jwt", { session: false });
// "use strict";
// var JwtStrategy = require("passport-jwt").Strategy;
// var ExtractJwt = require("passport-jwt").ExtractJwt;
// const passport = require("passport");
// var { secret } = require("./config");
// const pool = require('./mysqlConnection');

// // Setup work and export for the JWT passport strategy
// function auth() {
//   var opts = {};
//   opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
//   opts.secretOrKey = secret;
//   passport.use(
//     new JwtStrategy(opts, function (jwt_payload, done) {
//       const user_id = jwt_payload.user_id;
//       let sql = `CALL User_get('${user_id}')`;
//       pool.query(sql, (err, sqlResult) => {
//         if (err) {
//           return done(err, null);
//         }
//         if (sqlResult && sqlResult.length > 0 && sqlResult[0][0].status == 1) {
//           return done(null, sqlResult[0][0].email_id);
//         } else if(sqlResult && sqlResult.length > 0 && sqlResult[0][0].status == 0){
//           return done(null, false);
//         }
//       });
//     })
//   );
// }
// const checkAuth = passport.authenticate("jwt", { session: false });

// exports.auth = auth;
// exports.checkAuth = checkAuth;
