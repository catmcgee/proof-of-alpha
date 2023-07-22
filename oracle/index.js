const Koa = require("koa");
const Router = require("@koa/router");
const { isReady, PrivateKey, Field, Signature } = require("snarkyjs");
const { request, gql } = require('graphql-request');
const BigInt = require('big-integer'); // npm install big-integer

const PORT = 3000;

const app = new Koa();
const router = new Router();

const endpoint = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';  // replace with the actual endpoint

const GET_TRANSACTION = gql`
{
  transactions(where: {id: "0x07aac1d5997e4cb1c6bd88b15ab4500ef7dfe0b70919fdb69da62d9398e0b7bf"}) {
    timestamp
    swaps {
      recipient
      amount0
      amount1
      token0 {
        symbol
      }
      token1
      {
      symbol}
     
    }
  }
}

`;

async function getTransactionData(id) {
  const data = await request(endpoint, GET_TRANSACTION, { id });
  return data;
}

async function getSignedTransactionData(transactionId) {
  console.log("Inside getSignedTransactionData function");
  console.log("Transaction Id: ", transactionId);
  await isReady;

  const privateKey = PrivateKey.fromBase58(
    process.env.PRIVATE_KEY ??
      "EKEMMSEuAK8ybJ7Vxuf4Br4CtSZ8t7utt7ycgSjvRariHKVQQrck"
  );
  
  // Get transaction details
  const dataResponse = await getTransactionData(transactionId);
  const transaction = dataResponse.transactions[0].swaps[0];  // assuming each transaction only has one swap
  console.log(transaction)
  const walletIdBigInt = BigInt(transaction.recipient.substring(2), 16); // Remove `0x` and convert from base16
  const walletId = Field(walletIdBigInt.toString()); // Convert BigInt to base10 string and then create a Field
  console.log("wallet id", walletId)
    
  const publicKey = privateKey.toPublicKey();
  const id = Field(transactionId);
  console.log("public key", publicKey, "and id", id)
  const signature = Signature.create(privateKey, [id, walletId]);
  
  // Before returning, to ensure nothing changes
console.log("Returning data:", {
  data: { id: id, walletId: walletId },
  signature: signature,
  publicKey: publicKey,
});


  return {
    
    data: { id: id, walletId: walletId },
    signature: signature,
    publicKey: publicKey,
  };
}

router.get("/transaction/:id", async (ctx) => {
  const result = await getSignedTransactionData(ctx.params.id);
  ctx.body = result;
  // After creating signature and publicKey
console.log("Signature: ", signature);
console.log("Public Key: ", publicKey);


});


app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
