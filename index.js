module.exports = function (RED) {
    const {
        EventHubClient
    } = require("@azure/event-hubs");

    function sendMessageToEventHub(config) {
        // Create the Node-RED node
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            var messageJSON = null;
            node.log(this.name);
            node.log(this.credentials.connectionString);
            node.log(this.credentials.eventHubPath);
            node.log(typeof msg.payload)
            node.log(JSON.stringify(msg.payload));
            sendMessage(node, this.credentials.connectionString, this.credentials.eventHubPath, typeof(msg.payload) == 'string' ? JSON.parse(msg.payload): msg.payload);
        });
    }

    // Registration of the node into Node-RED
    RED.nodes.registerType("sendMessageToEventHub", sendMessageToEventHub, {
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
        const client = EventHubClient.createFromConnectionString(connectionString, eventHubPath);
        const eventData = {
            body: message
        };
        client.send(eventData);
        client.close();
    };
}
