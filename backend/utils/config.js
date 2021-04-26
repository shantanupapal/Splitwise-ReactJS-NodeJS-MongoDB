"use strict";
const config = {
    secret: "cmpe273_kafka_passport_mongo",
    frontendURI: "http://localhost:3000",
    kafkaURI: "localhost:2181",
    mongoDBURI:
        "mongodb+srv://shantanu:12345@splitwise.xc0rq.mongodb.net/splitwise?retryWrites=true&w=majority",
};

module.exports = config;
