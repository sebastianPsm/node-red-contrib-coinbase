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
            var client = new coinbase.Client({"apiKey": node.credentials["apiKey"], "apiSecret": node.credentials["apiSecret"]});
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
            root: __dirname + '/bower_components/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}
