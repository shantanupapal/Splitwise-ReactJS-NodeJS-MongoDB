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
            // console.log("jwt_payload: ", jwt_payload);
            // console.log("usr_id: ", user_id);
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
