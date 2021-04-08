"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
//var db = require('../app/db');
var User = require("../models/users");
//var config = require('./settings');
const secret = "secret";

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret,
    };
    passport.use(
        new JwtStrategy(opts, (jwt_payload, callback) => {
            User.findOne(
                {
                    Username: jwt_payload.Username,
                },
                (err, res) => {
                    if (res) {
                        var user = res;
                        delete user.Password;
                        callback(null, user);
                    } else {
                        callback(err, false);
                    }
                }
            );
        })
    );
};
