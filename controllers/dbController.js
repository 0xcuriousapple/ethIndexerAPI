const usertoTx = require('../models/usertoTx');
const Tx = require('../models/Tx');
const Web3 = require('web3');


// let promises_update = [];
// // promises.push(new Promise(function (resolve, reject) {}))
// async function aggregate() {
//     let docs = await usertoTx.aggregate([
//         {
//             $group: {

//                 _id: '$address',
//                 count: { $sum: 1 }
//             }
//         }
//     ]):
//     console.log(docs;
// }
async function update(item) {

    console.log(`Update Called for Tx ${item.hash} Block ${item.blockNumber}`);

    usertoTx.findOneAndUpdate({ address: item.from }, { $push: { tx: item.hash } }, { upsert: true }, function (err, res) {
        if (res) {
            console.log(`Entry for user ${item.from} updated`)
        }
        else {
            console.log(`Entry for user ${item.from} created`)
        }

    });

    usertoTx.findOneAndUpdate({ address: item.to }, { $push: { tx: item.hash } }, { upsert: true }, function (err, res) {
        if (res) {
            console.log(`Entry for user ${item.from} updated`)
        }
        else {
            console.log(`Entry for user ${item.from} created`)
        }
    });

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



    getDetails: async function (req, res) {
        let details = [];
        let temp = await usertoTx.findOne({ address: req.params.address }).exec()
        if (temp) {
            let promises = [];
            //console.log(temp);
            temp.tx.forEach(function (item) {
                // console.log(item);
                promises.push(new Promise(function (resolve, reject) {
                    Tx.findOne({ txhash: item }, function (err, res) {
                        details.push(res);
                    })
                        .then(() => {
                            resolve();
                        })
                }))

            })
            Promise.all(promises).then(() => { res.json({ details }); })

        }
        else {
            res.json({ 'Address not found': req.params.address })
        }


    },

    //this function is to update database to latest block
    updateDatabase: function (req, res) {




    },

    test: async function (req, res) {
        console.log('asasd');
        usertoTx.findOneAndUpdate({ address: "qqq" }, { $push: { tx: "dfg" } }, { upsert: true }, function (err, res) {
            console.log(res);
        });
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


                for (var i = latest; i > latest - 10; i--) {
                    console.log(`request for blockno ${i} made, ${i - latest + 9} remaining`)
                    batch.add(
                        web3.eth.getBlock.request(i, true, (err, res) => {
                            if (res) {
                                res.transactions.forEach(update);
                            }
                        })
                    )
                }
                batch.execute();



            }
        }
        )

    }


};


