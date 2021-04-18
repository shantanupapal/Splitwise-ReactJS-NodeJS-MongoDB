"use strict";
const connection = new require("./kafka/connection");
const connectMongoDB = require("./utils/dbConnection");

//import topics files
// const signupService = require("./services/signup");
// const profileService = require("./services/profile");
// const followService = require("./services/follow");
// const tweetService = require("./services/tweets");
// const tweetActionService = require("./services/tweetActions");
// const messageService = require("./services/messages");
// const bookmarkService = require("./services/bookmark");
// const accountService = require("./services/account");
// const searchService = require("./services/search");
// const listService = require("./services/list");
// const analyticsService = require("./services/analytics");
const signupService = require("./services/signup");
const loginService = require("./services/login");
const updateProfileService = require("./services/updateprofile");
const newgroup = require("./services/newgroup");
const usergroups = require("./services/usergroups");
const acceptgroupinvite = require("./services/acceptgroupinvite");
const addexpense = require("./services/addexpense");

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
// handleTopicRequest("usergroups", usergroups);
// handleTopicRequest("profile", profileService);
// handleTopicRequest("follow", followService);
// handleTopicRequest("tweets", tweetService);
// handleTopicRequest("tweet_actions", tweetActionService);
// handleTopicRequest("messages", messageService);
// handleTopicRequest("bookmarks", bookmarkService);
// handleTopicRequest("account", accountService);
// handleTopicRequest("search", searchService);
// handleTopicRequest("list", listService);
// handleTopicRequest("analytics", analyticsService);
