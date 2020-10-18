# ethIndexerAPI

Hey Hi! <br>
Abhishek here<br>
This is submission to [challenge](https://www.notion.so/Backend-Engineer-c3bc14e4fad04b40a486d5cbdad83093) proposed by you, the Matic team! <br>
Basically, I had to index Kovan net for the latest 10k blocks and store that in the database and expose that DB by API.

### [Demo](https://www.youtube.com/watch?v=CBIjbbXmeSk&feature=youtu.be)
# Result <br>
## Blocks Received : 10000 | Successful Updates : 48690 | Expected Updates : 48690 | Total Tx : 16230 | From 21598219 to 21588220
<a href="https://ibb.co/wzsG2W9"><img src="https://i.ibb.co/nLCdKcH/resultfinal.png" alt="resultfinal" border="0"></a>

# My Approach
There were multiple instances, where I had to make choice, <br>
The following are some of them. <br>
Cheers 🍷

## Requests to endpoint
My first thought was to request blocks one by one.But, in search of an optimized solution, I found **Batch requests**, which decrease the load on network traffic by doing requests in the batch. So here, 10000 blocks are requested in batches of 100. There is a problem with this approach though, as batch.execute() doesn't return promise or has a callback, you can't tell when the batch is done executing.<br>
Performance ⬆️  <br>
Reliability ⬇️ <br>

Reliability issue solved using "**retry(blockNumber, web3)**" in controllers/ dbcontroller.js<br>
**Aim : For the requests failed in batch**<br>
**Desc:** Some requests may get ECONNRESET, depending on our call frequency and connection<br>
For them, we are doing one by one (sync), by putting a good amount of time between each API call.<br>

## Programming Model (Async/Sync)
Given requests are independent of each other, the async model is the best choice.<br>
Performance ⬆️  <br>
Reliability ⬇️<br>

Reliability issue solved using **delayedExecute** in controllers/ dbcontroller.js <br>
**Aim: To distribute the instantaneous load on the database**<br>
**Desc:** delayedExecute is nothing but a wrapper around batch.execute() 
Consider we use batch.execute() directly, by batch we have decreased load on the endpoint, but when we get response from endpoint, the database calls in the batch update falls heavily on DB, resulting in load on memory and DB. To solve this what I did is, I added delay to each execution and increased it sequentially.<br>
Ex. For the first batch : 0 sec, Second: 12 sec, Third: 24 sec.<br>
At 0 all counters start, the first batch tx start indexing<br>z
After 12-sec Second batch tx start indexing<br>
**Please don't assume that all tx of one batch must get indexed in their 12 sec period only, it may go to the next window, most time it does as load increases.<br>
We are not ensuring that here, all we want is the distribution of load on period.** <br>
**Please go through [Demo](https://www.youtube.com/watch?v=CBIjbbXmeSk&feature=youtu.be) for better view** 

## Database Schema
My first thought was to keep the user as key and all the tx details as value.<br>
But then I realized that I am repeating tx details for both the "From" and "To" account.<br>
So I was storing a lot of reductant data.<br>
Then I optimized it by dividing a single model into two models<br>
One for User -> Tx Hash <br>
One for TxHash -> Details <br>
Efficiency ⬆️  <br>

## API Load balancing 
At first, I was requesting from only one endpoint, then I created 3 for better performance<br>
Performance ⬆️  <br>

# Instructions

 1. Clone the Repo and npm install
 2. Copy paste secret.json sent over mail into the config folder (If not received ping me on abhivispute33@gmail.com)
 3. npm start
 
 ## API Calls
 1. To Index 10k blocks from latest block : **localhost:3000/api/genesis**
 2. To get tx of user : **localhost:3000/api/getdetails/:address** 
 3. To get all transactions : **localhost:3000/api/getalltx**
 4. To get All users : **localhost:3000/api/getallusers**

# Repo Structure
Controllers: You will find most of the business logic here only<br>
Config :  MongoDB URI credentials<br>
Models: Database Models<br>
Routes: API routes<br>

### Complete Collections are available under fetched data folder
### Ping me on abhivispute33@gmail.com , if any there is any problem, Thanks !<br>
