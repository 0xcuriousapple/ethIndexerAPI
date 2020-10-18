# ethIndexerAPI

Hey Hi! 
Abhishek here
This is submission to [challenge](https://www.notion.so/Backend-Engineer-c3bc14e4fad04b40a486d5cbdad83093) proposed by you, the Matic team.

Basically, I had to index Kovan net for the latest 10k blocks and store that in the database and expose that DB by API.

# My Approach

There were multiple points, where I had to make choice,
The following are some of them.
Cheers 🍷

**1 Requests to endpoint**
My first thought was to request blocks one by one.
But, in search of an optimized solution, I found **Batch requests**, which decrease the load on network traffic by doing requests in the batch.
So here, 10000 blocks are requested in batches of 100
There is a problem with this approach though, as batch.execute() doesn't return promise or has a callback, you can't tell when the batch is done executing.
Performance ⬆️  
Reliability ⬇️
[ Solved using  
 "**retry(blockNumber, web3)**" in controllers/ dbcontroller.js
Aim : For the requests failed in batch
Desc: Some requests may get ECONNRESET, depending on our call frequency and connection
For them, we are doing one by one (sync), by putting a good amount of time between each API call.]

**2 Programming Model (Async/Sync)**
Given requests are independent of each other, the async model is the best choice.
Performance ⬆️  
Reliability ⬇️
[ Solved using same
 "**retry(blockNumber, web3)**]
 
**3 Database Schema**
My first thought was to keep the user as key and all the tx details as value.
But then I realized that I am repeating tx details for both the "From" and "To" account.
So I was storing a lot of reductant data.
Then I optimized it by dividing a single model into two models
One for User -> Tx Hash 
One for TxHash -> Details 
Efficiency ⬆️  

**4 API Load balancing**
At first, I was requesting from only one endpoint, then I created 3 for better performance
Performance ⬆️  

##  Instructions

 1. Copy paste secret.json sent over mail into the config folder (If not received ping me on abhivisput33@gmail.com)
 2. npm start
 
 ### API Calls
 1. To Index 10k blocks from latest block : **localhost:3000/api/genesis**
 2. To get tx of user : **localhost:3000/api/getdetails/:address** 
 3. To get all transactions : **localhost:3000/api/getalltx**
 4. To get All users : **localhost:3000/api/getallusers**

## Repo Structure
Controllers: You will find most of the business logic here only
Config :  MongoDB URI credentials
Models: Database Models
Routes: API routes

## Ping me on abhivisput33@gmail.com , if any there is any problem.

## Result : ScreenShots / Video