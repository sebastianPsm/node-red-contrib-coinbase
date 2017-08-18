# node-red-contrib-coinbase
Some Coinbase related nodes for [Node RED](https://nodered.org/)

![Simple example](https://raw.githubusercontent.com/sebastianPsm/node-red-contrib-coinbase/master/img/simple.png)

## How to use

1. Get a Coinbase API key and secret from [here](https://www.coinbase.com/signin)
2. Instantiate a new *Client* node from the library
3. Enter key and secret
4. Click on the renew button right next the the Account property and select a Account
5. Use output from *Client* node as input for the other nodes

![Client setup properties](https://raw.githubusercontent.com/sebastianPsm/node-red-contrib-coinbase/master/img/client_setup.png)

### *Get buy price* node

Connect with *Client* node and enter *Currency pair* property (e.g. ETH-EUR or BTC-USD).

### *get account* node

Connect with *Client* node. Node will output something like the following on ```msg.account```

```javascript
{
  "id": "2bbf394c-193b-5b2a-9155-3b4732659ede",
  "name": "My Wallet",
  "primary": true,
  "type": "wallet",
  "currency": "BTC",
  "balance": {
      "amount": "39.59000000",
      "currency": "BTC"
  },
  "native_balance": {
      "amount": "395.90",
      "currency": "USD"
  },
  "created_at": "2015-01-31T20:49:02Z",
  "updated_at": "2015-01-31T20:49:02Z",
  "resource": "account",
  "resource_path": "/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede"
}
```

## One word on entering the coinbase key and secret
Node RED provide credential properties. This properties will not exported in the flow file when the flows are exported. Further information can be found [here](https://nodered.org/docs/creating-nodes/credentials).

## Todo

- <i>Sell</i>, <i>Send</i>, <i>Request</i>, <i>Transaction</i> nodes
- Separate code files for each node for the sake of simplicity
- More?