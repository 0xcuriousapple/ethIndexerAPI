const usertoTx = require('../models/usertoTx');
const Tx = require('../models/Tx');
const Web3 = require('web3');

async function update(item) {

    console.log(`Update Called for Tx ${item.hash} Block ${item.blockNumber}`);

    // Updating for user from
    var temp = await usertoTx.findOne({ address: item.from }).exec();
    if (temp) {
        temp.tx.push({ hash });
        temp.save();
    }
    else {
        usertoTx.create({
            address: item.from,
            tx: [{ hash }]
        })
    }

    // Updating for user to
    temp = await usertoTx.findOne({ address: item.to }).exec();
    if (temp) {
        temp.tx.push({ hash });
        temp.save();
    }
    else {
        usertoTx.create({
            address: item.to,
            tx: [{ hash }]
        })
    }

    // Saving Tx 
    Tx.create(
        {
            txhash: item.hash,
            from: item.from,
            to: item.to,
            value: item.value,
            blockNumber: item.blockNumber,
        }
    )

}

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


        web3.eth.getBlockNumber(function (error, result) {

            if (!error) {
                const latest = result;
                const batch = new web3.eth.BatchRequest()
                for (var i = latest; i > latest - 2; i--) {
                    batch.add(
                        web3.eth.getBlock.request(i, true, (err, res) => {
                            console.log(res)
                            if (res) {
                                res.transactions.forEach(update)
                            }
                        })
                    )
                }


                batch.execute()


            }
        }
        )
        res.json({ 'Data Created': 'Thank You' })
    }


};


