"use strict";
const connection = new require("./kafka/connection");
const connectMongoDB = require("./utils/dbConnection");

//import topics files
const signupService = require("./services/signup");
const loginService = require("./services/login");
const updateProfileService = require("./services/updateprofile");
const newgroup = require("./services/newgroup");
const usergroups = require("./services/usergroups");
const acceptgroupinvite = require("./services/acceptgroupinvite");
const addexpense = require("./services/addexpense");
const dashboarddetails = require("./services/dashboarddetails");
const getgroupexpenses = require("./services/getgroupexpenses");
const recentactivity = require("./services/recentactivity");
const addcomment = require("./services/addcomment");
const deletecomment = require("./services/deletecomment");
const leavegroup = require("./services/leavegroup");
const updateprofilephoto = require("./services/updateprofilephoto");

//MongoDB connection
connectMongoDB();

//Handle topic request
const handleTopicRequest = (topic_name, fname) => {
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log("Kafka Server is running ");
    consumer.on("message", function (message) {
        console.log("Message received for " + topic_name);
        var data = JSON.parse(message.value);
        fname.handle_request(data.data, (err, res) => {
            response(data, res, err, producer);
            return;
        });
    });
};

const response = (data, res, err, producer) => {
    var payloads = [
        {
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res,
                err: err,
            }),
            partition: 0,
        },
    ];
    producer.send(payloads, function (err, data) {
        if (err) {
            console.log("Error when producer sending data", err);
        } else {
            console.log(data);
        }
    });
    return;
};

// Topics
handleTopicRequest("signup", signupService);
handleTopicRequest("login", loginService);
handleTopicRequest("updateprofile", updateProfileService);
handleTopicRequest("newgroup", newgroup);
handleTopicRequest("usergroups", usergroups);
handleTopicRequest("acceptgroupinvite", acceptgroupinvite);
handleTopicRequest("addexpense", addexpense);
handleTopicRequest("dashboarddetails", dashboarddetails);
handleTopicRequest("getgroupexpenses", getgroupexpenses);
handleTopicRequest("recentactivity", recentactivity);
handleTopicRequest("addcomment", addcomment);
handleTopicRequest("deletecomment", deletecomment);
handleTopicRequest("leavegroup", leavegroup);
handleTopicRequest("updateprofilephoto", updateprofilephoto);
