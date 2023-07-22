import { Mina, PublicKey, fetchAccount, Field, PrivateKey, Signature } from 'snarkyjs';
const BigInt = require('big-integer'); // npm install big-integer

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import { SwapsOracle } from '../../../contracts/src/SwapsOracle';
import { verify } from 'crypto';

const state = {
  SwapsOracle: null as null | typeof SwapsOracle,
  zkapp: null as null | SwapsOracle,
  transaction: null as null | Transaction,
};

const privateKey = PrivateKey.fromBase58(
  process.env.PRIVATE_KEY ??
    "EKEFbfuextCwUWrWBFj1NPvhQDiMP2wB4NiT6aCJJWRyhbjiTyuD"
);

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network(
      'https://proxy.berkeley.minaexplorer.com/graphql'
    );
    console.log('Berkeley Instance Created');
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { SwapsOracle } = await import('../../../contracts/build/src/SwapsOracle.js');
    state.SwapsOracle = SwapsOracle;
  },
  compileContract: async (args: {}) => {
    const verificationKey = await state.SwapsOracle!.compile();
    console.log("verificaion key", verificationKey.verificationKey.hash)

  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.SwapsOracle!(publicKey);
  },

  verify: async (args: { publicKey58: string }) => {
    const txBigInt = BigInt("0xaecc64a55d46551E410d3875201E9B8cd63827Eb".substring(2),16)
    const txId = Field(txBigInt);
    console.log("txid", txId)
    console.log("txid to string", txId.toString())

    const walletBigInt = BigInt("0xaecc64a55d46551E410d3875201E9B8cd63827Eb".substring(2),16)
    const walletId = Field(walletBigInt);
    console.log("walletid", txId)
    console.log("walletid to string", walletId.toString())


    const signature = Signature.create(privateKey, [txId, walletId]);
    const publicKey = PublicKey.fromBase58(args.publicKey58);
   // create the tx
    const tx = await Mina.transaction(publicKey, () => state.zkapp.verify(txId, walletId, signature));
    await tx.prove();
    await tx.send();
    await tx.sign([privateKey]);

  },
  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },

  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },


};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== 'undefined') {
  addEventListener(
    'message',
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}

console.log('Web Worker Successfully Initialized.');
