# node-red-contrib-dl-azure-event-hub
This custom node-red node is used to send messages to the Azure Event Hub.

## Input Parameters

### Name (Optional)
The name parameter takes a string as input. The string would appear as the name of the node. 
Default Value is: dlEventHubSend

### Connection String (Mandatory):
The endpoint connection string which allows you to connect to the event hub.
Format: Endpoint=sb://XXXXXXXXX-prd.servicebus.windows.net/;SharedAccessKeyName=XXXX;SharedAccessKey=XXXXX

### Event Hub path (Mandatory):
The name of the event hub where the messages have to be sent to.

## Screenshot


## Installation
```
npm i node-red-contrib-dl-azure-event-hub
```

## Usage
1. Copy the below JSON
```JSON
[{"id":"864e40f6.22f76","type":"tab","label":"Azure Event Hub Send Message","disabled":false,"info":""},{"id":"22085b05.857334","type":"inject","z":"864e40f6.22f76","name":"Send Payload","topic":"","payload":"{\"data\": \"{temperature: 95, wind: 10}\" }","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":"","x":190,"y":300,"wires":[["27a034a5.375acc"]]},{"id":"3110b8b3.46b708","type":"debug","z":"864e40f6.22f76","name":"","active":true,"console":"false","complete":"true","x":802.000054359436,"y":299.9299564361572,"wires":[]},{"id":"27a034a5.375acc","type":"clovitySendAzureEventHubMessages","z":"864e40f6.22f76","name":"Clovity - Send - Azure Event Hub","x":520,"y":320,"wires":[["3110b8b3.46b708"]]}]
```

2. Access the node-red UI using http://localhost:1880. Click on Import-->Clipboard and paste the copied json in the text area and Click Import.

3. Update the Name, Connection String and Event Hub path parameters with the ones you wish to send messages to.





