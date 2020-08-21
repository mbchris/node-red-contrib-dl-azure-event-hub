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
        
        try {
            const batchOptions = { /*e.g. batch size*/ };
            const producerClient = new EventHubProducerClient(connectionString, eventHubPath);
            setStatus("open", "connecting...");

            //create new batch with options
            var batch = await producerClient.createBatch(batchOptions);

            //try to add an event to the batch
            const isAdded = batch.tryAdd({ body: message });

            if( isAdded === false ) {
                node.warn("Failed to add event to the batch. Possible information loss.");
            }
            //send batch
            await producerClient.sendBatch(batch);
            setStatus("sent", "message sent");

        } catch (err) {
            console.log("Error when creating & sending a batch of events: ", err);
            setStatus("error", "communication failed");
        }
        //close connection
        await producerClient.close();
        setStatus("close", "connection closed");
    };

    /*
    * sets the node status
    */
    function setStatus(status, message) {
        var obj;

        switch (status) {
            case 'open':
                obj = {
                    fill: 'yellow',
                    shape: 'dot',
                    text: message
                };
                break;
            case 'connected':
                obj = {
                    fill: 'green',
                    shape: 'dot',
                    text: message
                };
                break;
            case 'close':
                obj = {
                    fill: 'grey',
                    shape: 'dot',
                    text: message
                };
                break;
            case 'sent':
                obj = {
                    fill: 'blue',
                    shape: 'dot',
                    text: message
                };
                break;
            case 'error':
                obj = {
                    fill: 'red',
                    shape: 'dot',
                    text: message
                };
                break;
            default:
                obj = {
                    fill: 'grey',
                    shape: 'dot',
                    text: message
                };
        }
        return obj;
    }
}
