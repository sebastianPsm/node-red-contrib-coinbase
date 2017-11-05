var coinbase = require('coinbase');

module.exports = function(RED) {
    function Client(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        if(!node.credentials || !node.credentials["apiKey"] || !node.credentials["apiSecret"]) {
            node.status({fill:"red",shape:"ring",text:"apiKey or apiSecret not entered. Please check."});
            return;
        }
        setTimeout(function(){
            var client = new coinbase.Client({
                "apiKey": node.credentials["apiKey"], 
                "apiSecret": node.credentials["apiSecret"]
            });
            if(client === undefined) return;
            node.status({fill:"green",shape:"dot",text:"initialized"});

            var msg = {
                payload: "coinbase connected",
                coinbase: client,
                accountId: config.accountSelected
            };

            node.send(msg);
        }, 500);

        node.on('close', function() {
        });
    };
    RED.nodes.registerType("coinbase-client", Client, {
        credentials: {
            apiKey: {type:"apiKey"},
            apiSecret: {type:"apiSecret"}
        }
    });
}
