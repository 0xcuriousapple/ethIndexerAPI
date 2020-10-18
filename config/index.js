const fs = require('fs');

const file = fs.readFileSync("config/secret.json").toString();
const dbname = 'ethIndexer'

console.log(JSON.parse(file))
const MONGODB_URI = `mongodb+srv://${JSON.parse(file).dbuser}:${JSON.parse(file).dbpassword}@cluster0-co47j.gcp.mongodb.net/${dbname}?retryWrites=true&w=majority`;

module.exports = MONGODB_URI;
