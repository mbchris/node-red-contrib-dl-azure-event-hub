# node-red-contrib-dl-azure-event-hub
This node can be used to send messages from node-RED to the Azure EventHub. It was forked since the original node from clovity showed instabilities (node-red restarts after several days depending on the memory of your device).

It is based on https://github.com/clovityinc/node-red-contrib-azure-event-hub-send-message therefore the documentation was extracted and modified from there.

## Input Parameters

### Name (Optional)
Rename your node

### Connection String (Mandatory):
Get the connection string from your eventHub instance after setting up the security rules.
Endpoint=sb://????????.servicebus.windows.net/;SharedAccessKey=????????;EntityPath=????????

### Event Hub path (Mandatory):
Adress path of the eventHub to which the messages should be addressed.

## Screenshot
![Alt text](/images/dlEventHubSend.JPG?raw=true "Example flow")

## Installation
```
npm install --no-audit --no-update-notifier --save --save-prefix="~" --production node-red-contrib-dl-azure-event-hub
```

## Usage
1. Example JSON here
```JSON
[{"id":"fd10864e.6503c8","type":"tab","label":"EventHub Example","disabled":false,"info":""},{"id":"9f719c.4f639e68","type":"inject","z":"fd10864e.6503c8","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":350,"y":280,"wires":[["7604c298.e6856c"]]},{"id":"7604c298.e6856c","type":"function","z":"fd10864e.6503c8","name":"set telemetry data","func":"let tem = 20;   //°C \nlet pre = 1013; //hPa\nlet en = 3120;  //Wh\n\n// Everything inside the 'payload' field will be transfered to the eventHub\nmsg.payload = {\n    'data' : {\n        'temperature' : tem,\n        'pressure': pre,\n        'energy': en\n    }\n};\nreturn msg;","outputs":1,"noerr":0,"x":580,"y":280,"wires":[["54dc0045.3a342"]]},{"id":"54dc0045.3a342","type":"dlEventHubSend","z":"fd10864e.6503c8","name":"dlEventHubSend","x":820,"y":280,"wires":[[]]},{"id":"ed848e5c.968d1","type":"comment","z":"fd10864e.6503c8","name":"1. enter here your ConnectionString","info":"","x":870,"y":210,"wires":[]},{"id":"29765d3.f21a5a2","type":"comment","z":"fd10864e.6503c8","name":"2. enter here your EventHub path","info":"","x":860,"y":240,"wires":[]}]
```
