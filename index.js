module.exports = function (RED) {
    const {
        EventHubProducerClient
    } = require("@azure/event-hubs");

    function dlEventHubSend(config) {
        // Create the Node-RED node
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            node.log(this.name);
            node.log(this.credentials.connectionString);
            node.log(this.credentials.eventHubPath);
            node.log(typeof msg.payload)
            node.log(JSON.stringify(msg.payload));
            sendMessage(node, this.credentials.connectionString, this.credentials.eventHubPath, typeof(msg.payload) == 'string' ? JSON.parse(msg.payload): msg.payload);
        });
    }

    // Registration of the node into Node-RED
    RED.nodes.registerType("dlEventHubSend", dlEventHubSend, {
        defaults: {
            name: {
                value: "Send Message To Azure EventHub"
            }
        },
        credentials: {
            connectionString: {
                type: "text"
            },
            eventHubPath: {
                type: "text"
            }
        }
    });

    var sendMessage = function (node, connectionString, eventHubPath, message) { 
        const producerClient = new EventHubProducerClient(connectionString, eventHubPath);

        const eventData = {
            body: message
        };
        node.log("dlEventHubSend --> sendMessage --> sendBatch(): " + JSON.stringify(producerClient.sendBatch(eventData)));
        producerClient.close();
    };
}
