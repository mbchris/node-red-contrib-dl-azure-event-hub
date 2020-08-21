module.exports = function (RED) {
    "use strict";

    const {
        EventHubProducerClient
    } = require("@azure/event-hubs");

    function dlEventHubSend(config) {
        // Create the Node-RED node
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
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
    
    /*
    * sends the events in shape of batchs to the event hub
    */
    async function sendMessage(node, connectionString, eventHubPath, message) { 

        const batchOptions = { /*e.g. batch size*/ };
        const producerClient = new EventHubProducerClient(connectionString, eventHubPath);
        node.log("connecting the producer client...");
        node.status({
            fill: 'yellow',
            shape: 'dot',
            text: "connecting..."
        });

        try {
            //create new batch with options
            var batch = await producerClient.createBatch(batchOptions);
            node.log("create empty batch with following options:");
            node.log(batchOptions);

            //transform string to JSON if necessary
            if (typeof (msg.payload) != "string") {
                node.log("Is JSON");
                msgJSON = msg.payload;
            } else {
                node.log("Is String...converting");
                //Converting string to JSON Object
                msgJSON = JSON.parse(msg.payload);
            }

            //try to add an event to the batch
            const isAdded = batch.tryAdd({ body: msgJSON });
            node.log("try to add the following event to the batch:");
            node.log(JSON.stringify(message));

            if( isAdded === false ) {
                var warnText = "Failed to add event to the batch. Possible information loss.";
                node.warn(warnText);
                node.log(warnText);
            }

            //send batch
            await producerClient.sendBatch(batch);
            node.log("sent batch to event hub.");
            node.status({
                fill: 'blue',
                shape: 'dot',
                text: "sent message"
            });

        } 
        catch (err) {
            node.log("Error when creating & sending a batch of events: ", err);
            node.status({
                fill: 'red',
                shape: 'dot',
                text: "communication failed"
            });
        }
        //close connection
        await producerClient.close();
        node.log("Disconnect producer client.");
        node.status({
            fill: 'grey',
            shape: 'dot',
            text: "connection closed"
        });
    };
}
