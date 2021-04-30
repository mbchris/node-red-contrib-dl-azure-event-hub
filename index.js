module.exports = function (RED) {
    "use strict";

    const { EventHubProducerClient } = require("@azure/event-hubs");
    
    // add support for proxy and websocket connection
    const WebSocket = require("ws");
    const url = require("url");
    const httpsProxyAgent = require("https-proxy-agent");

    // Create an instance of the `HttpsProxyAgent` class with the proxy server information like
    // proxy url, username and password
    // Skip this section if you are not behind a proxy server
    const urlParts = url.parse("http://localhost:3128");
    urlParts.auth = "username:password"; // Skip this if proxy server does not need authentication.
    const proxyAgent = new httpsProxyAgent(urlParts);
    
    function dlEventHubSend(config) {
        // Create the Node-RED node
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', async function (msg) {
            var DEBUG = config.debug;
            const batchOptions = { /*e.g. batch size*/ };
            //const producerClient = new EventHubProducerClient(node.credentials.connectionString, node.credentials.eventHubPath);
            const producerClient = new EventHubProducerClient(node.credentials.connectionString, node.credentials.eventHubPath, {
               webSocketOptions: {
                    webSocket: WebSocket,
                    webSocketConstructorOptions: { agent: proxyAgent }
                }
            });
            
            node.log("connecting the producer client...");
            node.status({
                fill: 'yellow',
                shape: 'dot',
                text: "connecting..."
            });
            if(DEBUG === true) {
                node.warn("open the producerClient connection.");
                node.warn("producerClient object:");
                node.send(producerClient);
            }

            try {
                //create new batch with options
                var batch = await producerClient.createBatch(batchOptions);
                var msgJSON;
                node.log("create empty batch with following options:");
                node.log(batchOptions);
                if(DEBUG === true) {
                    node.warn("create empty batch.");
                    node.warn("batchOptions:");
                    node.send(batchOptions);
                }

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
                node.log(JSON.stringify(msg.payload));
                if(DEBUG === true) {
                    node.warn("try to add message to the batch.");
                    node.warn("message content:");
                    node.send(msg);
                }

                if( isAdded === false ) {
                    var warnText = "Failed to add event to the batch. Possible information loss.";
                    node.warn(warnText);
                    node.log(warnText);
                    if(DEBUG === true) {
                        node.warn("adding failed.");
                    }
                }

                //send batch
                await producerClient.sendBatch(batch);
                node.log("sent batch to event hub.");
                node.status({
                    fill: 'blue',
                    shape: 'dot',
                    text: "sent message"
                });
                if(DEBUG === true) {
                    node.warn("sent the batch.");
                }

            } 
            catch (err) {
                node.log("Error when creating & sending a batch of events: ", err);
                node.status({
                    fill: 'red',
                    shape: 'dot',
                    text: "communication failed"
                });
                if(DEBUG === true) {
                    node.warn("got an unexpected error.");
                    node.warn("error object:");
                    node.send(err);
                }
            }
            //close connection
            await producerClient.close();
            node.log("Disconnect producer client.");
            node.status({
                fill: 'grey',
                shape: 'dot',
                text: "connection closed"
            });
            if(DEBUG === true) {
                node.warn("close the producerClient connection.");
            }
        });
    }

    // Registration of the node into Node-RED
    RED.nodes.registerType("dlEventHubSendProxy", dlEventHubSend, {
        defaults: {
            name: {
                value: "Send Message To Azure EventHub using a proxy"
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
}
