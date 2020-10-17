const usertoTx = require('../models/usertoTx');
const Tx = require('../models/Tx');
const Web3 = require('web3');


module.exports = {



    getDetails: function (req, res) {

    },

    updateDatabase: function (req, res) {




    },

    genesis: async function (req, res) {


        const provider = new Web3.providers.HttpProvider(
            "https://kovan.infura.io/v3/5c50a42c0c204dbcb9d61d538046a36c"
        );
        const web3 = new Web3(provider);


        const latest = await web3.eth.getBlockNumber()

        const batch = new web3.eth.BatchRequest()

        for (var i = latest; i > latest - 2; i--) {
            batch.add(
                web3.eth.getBlock.request(i, true, (err, res) => { console.log(res) })
            )
        }


        batch.execute()
        console.log("endpoint working");
        res.json({ 'as': "as" })
    }
};


