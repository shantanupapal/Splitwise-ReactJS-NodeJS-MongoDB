"use strict";
const kafka = require("kafka-node");
const { kafkaURI } = require("../utils/config");

function ConnectionProvider() {
  this.getConsumer = function(topic_name) {
    this.client = new kafka.KafkaClient(kafkaURI);
    this.kafkaConsumerConnection = new kafka.Consumer(this.client, [
      { topic: topic_name, partition: 0 }
    ]);
    this.client.on("ready", function() {
      console.log("Client ready!");
    });
    return this.kafkaConsumerConnection;
  };

  this.getProducer = function() {
    if (!this.kafkaProducerConnection) {
      this.client = new kafka.KafkaClient(kafkaURI);
      var HighLevelProducer = kafka.HighLevelProducer;
      this.kafkaProducerConnection = new HighLevelProducer(this.client);
      console.log("Producer ready");
    }
    return this.kafkaProducerConnection;
  };
}
exports = module.exports = new ConnectionProvider();
