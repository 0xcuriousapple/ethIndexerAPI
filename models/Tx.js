const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const txSchema = new Schema({

    txhash: {},
    from: {},
    to: {},
    value: {},
    blockNumber: {},

});

const Tx = mongoose.model('Tx', txSchema);

module.exports = Tx;