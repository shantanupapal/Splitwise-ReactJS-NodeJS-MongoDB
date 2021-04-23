"use strict";
const config = {
    secret: "cmpe273_kafka_passport_mongo",
    frontendURI: "http://localhost:3000",
    kafkaURI: "localhost:2181",
    awsBucket: "cmpe273twitter",
    // Keys can't be added here because AWS categorizes this as vulnerability.
    awsAccessKey: "",
    awsSecretAccessKey: "",
    awsPermission: "public-read",
    mongoDBURI:
        "mongodb+srv://shantanu:12345@splitwise.xc0rq.mongodb.net/splitwise?retryWrites=true&w=majority",
};

module.exports = config;
