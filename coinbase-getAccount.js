var coinbase = require('coinbase');

module.exports = function(RED) {
    function GetAccount(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.currencyPair = config.currencyPair;
        node.interval = config.interval;
        if(config.interval === undefined) node.interval = 10000;
        
        node.on("input", function(msg) {
            if(msg.coinbase === undefined) return;
            var client = msg.coinbase;
            var accountId = msg.accountId;

            if(client && accountId) {
                node.myInterval = setInterval(function() {
                    client.getAccount(accountId, function(err, account) {
                        if(err !== null) {
                            node.status({fill:"red", shape:"ring", text:err.message});
                            return;
                        }
                        var msg = {
                            account: account
                        };
                        node.send(msg);
                        node.status({text: "" + account.balance.amount + " " + account.balance.currency});
                    });
                }, node.interval);
            }
        });
        node.on('close', function() {
            clearInterval(node.myInterval);
        });
    }
    RED.nodes.registerType("coinbase-get-account", GetAccount);

    /*
     * Provide additional libraries for the editor
     */
    RED.httpAdmin.get('/coinbase/js/*', function(req, res){
        var options = {
            root: __dirname + '/../',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}
