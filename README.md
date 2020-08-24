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
Address path of the eventHub to which the messages should be addressed.

### Debug
Switch on/off debug information on your Node-RED debug console.

## Screenshot
![Alt text](/images/dlEventHubSend.JPG?raw=true "Example flow")

## Installation
```
npm install --no-audit --no-update-notifier --save --save-prefix="~" --production node-red-contrib-dl-azure-event-hub
```

## Usage
1. Example JSON here
```JSON
[{"id":"7e714238.79b4fc","type":"tab","label":"Flow 1","disabled":false,"info":""},{"id":"609b653f.45e3bc","type":"dlEventHubSend","z":"7e714238.79b4fc","name":"dlEventHubSend","debug":false,"x":670,"y":180,"wires":[["d6361d05.eb08a"]]},{"id":"1eb696ff.3907e9","type":"comment","z":"7e714238.79b4fc","name":"1. ConnectionString","info":"","x":670,"y":100,"wires":[]},{"id":"cc37a272.4e619","type":"comment","z":"7e714238.79b4fc","name":"2. EntityPath","info":"","x":650,"y":140,"wires":[]},{"id":"e36c7765.1042f","type":"function","z":"7e714238.79b4fc","name":"","func":"msg.payload = {\n    \"depot_hub\": \"Trash_Hub\",\n    \"source_type\": \"MyDevice1\",\n    \"version\": \"0.1\",\n    \"timestamp\": new Date().toJSON(),\n    \"data\": {\n        \"machine 1\": {\n            \"temperature\": 20.01,\n            \"pressure\": 1013,\n            \"relHg\": 60\n        }\n    }\n};\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":420,"y":180,"wires":[["609b653f.45e3bc"]]},{"id":"c4e9ea46.e588b8","type":"inject","z":"7e714238.79b4fc","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"60","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":230,"y":180,"wires":[["e36c7765.1042f"]]},{"id":"a576b120.bfc598","type":"function","z":"7e714238.79b4fc","name":"","func":"msg.payload = {\n    \"depot_hub\": \"Trash_Hub\",\n    \"source_type\": \"MyDevice1\",\n    \"version\": \"0.1\",\n    \"timestamp\": new Date().toJSON(),\n    \"data\": {\n        \"machine 2\": {\n            \"temperature\": 26.33,\n            \"pressure\": 1001,\n            \"relHg\": 56\n        }\n    }\n};\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":420,"y":220,"wires":[["609b653f.45e3bc"]]},{"id":"15b740a8.4cde97","type":"inject","z":"7e714238.79b4fc","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"45","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":230,"y":220,"wires":[["a576b120.bfc598"]]},{"id":"be43a0a2.9c4398","type":"function","z":"7e714238.79b4fc","name":"","func":"msg.payload = {\n    \"depot_hub\": \"Trash_Hub\",\n    \"source_type\": \"MyDevice1\",\n    \"version\": \"0.1\",\n    \"timestamp\": new Date().toJSON(),\n    \"data\": {\n        \"machine 3\": {\n            \"temperature\": 28.75,\n            \"pressure\": 1031,\n            \"relHg\": 44\n        }\n    }\n};\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":420,"y":260,"wires":[["609b653f.45e3bc"]]},{"id":"d3ae4323.bbbe08","type":"inject","z":"7e714238.79b4fc","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"30","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":230,"y":260,"wires":[["be43a0a2.9c4398"]]},{"id":"d6361d05.eb08a","type":"debug","z":"7e714238.79b4fc","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":880,"y":180,"wires":[]}]
```
