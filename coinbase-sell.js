var coinbase = require('coinbase');

module.exports = function(RED) {
    function Sell(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.currencyPair = config.currencyPair;
        
        node.on("input", function(msg) {
            if(msg.coinbase === undefined) return;
            var client = msg.coinbase;
        });
        node.on('close', function() {
        });
    }
    RED.nodes.registerType("coinbase-sell",Sell);
}
