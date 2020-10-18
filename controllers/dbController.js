const usertoTx = require('../models/usertoTx');
const Tx = require('../models/Tx');
const Web3 = require('web3');



// To count successful requests from node ie : no of blocks received
let count = 0;

// To count sucessful updates in database
let ucount = 0;

// To count expected updates in database
let ecount = 0;

// Aim : For the requests failed in batch
// Desc : 
// Some requests may get ECONNRESET, depending on on our call freqency and connection
// For them, we are doing one by one, by putting good amuount of time between each API call.

async function retry(blockNumber) {
    setTimeout(() => {
        console.log(`Requesting block ${blockNumber} again`)
        web3.eth.getBlock(blockNumber, function (err, block) {
            if (err) {
                console.log(`Repeat Error for ${blockNumber}`)
                retry(blockNumber);
                //may lead to to infinite loop, better condition is needed, we will see it later, for now, lets assume user notice this from console statement
            }
            if (res) {
                console.log(` block ${blockNumber} received`)
                res.transactions.forEach(update);
                count++;
            }
        })
    }, 2000);

}



async function update(item) {

    console.log(`Update Called for Tx ${item.hash} Block ${item.blockNumber}`);
    let x = 0;
    usertoTx.findOneAndUpdate({ address: item.from }, { $push: { tx: item.hash } }, { upsert: true }, function (err, res) {
        if (res) {
            ucount++;
            console.log(`update from for tx ${item.hash}`)
            // console.log(`Entry for user ${item.from} updated`)
        }
        // else {
        //     console.log(`Entry for user ${item.from} created`)
        // }

    });

    usertoTx.findOneAndUpdate({ address: item.to }, { $push: { tx: item.hash } }, { upsert: true }, function (err, res) {
        if (res) {
            ucount++;
            console.log(`update to for tx ${item.hash}`)
            //console.log(`Entry for user ${item.from} updated`)
        }
        // else {
        //     console.log(`Entry for user ${item.from} created`)
        // }
    });

    Tx.create(
        {
            txhash: item.hash,
            from: item.from,
            to: item.to,
            value: item.value,
            blockNumber: item.blockNumber,
        }, function (error, result) {
            if (result) {
                ucount++;
                console.log(`create tx ${item.hash}`)
            }
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

        // Get Latest Block Number
        const latest = await web3.eth.getBlockNumber()

        // Doing 10000 req in Batch of 100

        let batch = new web3.eth.BatchRequest()
        let j = 0;

        for (var i = latest; i > latest - 10; i--) {
            console.log(`request for blockno ${i} made, ${i - latest + 9999} remaining`)
            batch.add(
                web3.eth.getBlock.request(i, true, (err, res) => {
                    if (res) {
                        ecount = ecount + res.transactions.length * 3;
                        res.transactions.forEach(update);
                        count++;
                    }
                    else {
                        retry(i);
                    }
                })
            )
            j++;
            if (j % 100 == 0) {
                j = 0;
                batch.execute();
                batch = new web3.eth.BatchRequest()
                //console.log('Batch of 100 requested')
            }

        }

        batch.execute()

        setInterval(() => {
            console.log(`Blocks Received : ${count} | Successful Updates in DB : ${ucount} | Expected Updates in DB : ${ecount} | Indexing ${latest} to ${latest - 9999}`)
        }, 20000);

        res.json({ 'Please Check Console': 'Thanks !' })
    }





};


