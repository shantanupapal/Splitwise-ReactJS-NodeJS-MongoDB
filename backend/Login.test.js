var assert = require("chai").assert;
var app = require("./index");

var chai = require("chai");
chai.use(require("chai-http"));
var expect = require("chai").expect;

var agent = require("chai").request.agent(app);

// describe("Splitwise", function () {
//     describe("Test for login", function () {
//         it("Password Incorrect", () => {
//             agent
//                 .post("/login")
//                 .send({ email: "papaldevika@gmail.com", password: "devikaaa" })
//                 .then(function (res) {
//                     expect(res.text).to.equal("Wrong credentials");
//                 })
//                 .catch((error) => {
//                     console.log(error);
//                 });
//         });

//         it("Invalid User", () => {
//             agent
//                 .post("/login")
//                 .send({ email: "ffff@gmail.com", password: "gggg" })
//                 .then(function (res) {
//                     expect(res.text).to.equal("No user found");
//                 })
//                 .catch((error) => {
//                     console.log(error);
//                 });
//         });

//         it("Login Successful", () => {
//             agent
//                 .post("/login")
//                 .send({ email: "papaldevika@gmail.com", password: "shantanu" })
//                 .then(function (res) {
//                     expect(res.status).to.equal(200);
//                 })
//                 .catch((error) => {
//                     console.log(error);
//                 });
//         });
//     });
// });

describe("Signup Test", () => {
    it("User already present", () => {
        agent
            .post("/signup")
            .send({
                name: "devika",
                email: "papaldevika@gmail.com",
                password: "shantanu",
            })
            .then(function (res) {
                expect(res.text).to.equal(
                    "Email already exist. Please enter another email"
                );
            })
            .catch((error) => {
                console.log(error);
            });
    });

    it("Signup success", () => {
        agent
            .post("/signup")
            .send({
                name: "newuser",
                email: "newuser@gmail.com",
                password: "newuser",
            })
            .then(function (res) {
                expect(res.status).to.equal(200);
            })
            .catch((error) => {
                console.log(error);
            });
    });
});
