var coinbase = require('coinbase');

module.exports = function(RED) {
    function GetBuyPrice(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.currencyPair = config.currencyPair;
        node.interval = config.interval;
        if(config.interval === undefined) node.interval = 1000;
        
        node.on("input", function(msg) {
            if(msg.coinbase === undefined) return;
            var client = msg.coinbase;

            node.myInterval = setInterval(function() {
                client.getBuyPrice({'currencyPair': node.currencyPair}, function(err, obj) {
                    if(err !== null) {
                        node.status({fill:"red", shape:"ring", text:err.message});
                        return;
                    }
                    var msg = {
                        payload : obj.data.amount,
                        currency : obj.data.currency
                    };
                    node.status({text: "" + obj.data.amount + " " + obj.data.currency});
                    node.send(msg);
                });
            }, node.interval);
        });
        node.on('close', function() {
            clearInterval(node.myInterval);
        });
    }
    RED.nodes.registerType("coinbase-get-buy-price",GetBuyPrice);
}
