import { Mina, PublicKey, fetchAccount, Field, PrivateKey, Signature } from 'snarkyjs';

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
    const signature = Signature.create(privateKey, [Field(7159974168815450070709196962939807), Field(7159974168815450070709196962939807)]);
    const publicKey = PublicKey.fromBase58(args.publicKey58);
   // create the tx
    const tx = await Mina.transaction(publicKey, () => state.zkapp.verify(Field(7159974168815450070709196962939807), Field(7159974168815450070709196962939807), signature));
    // this runs your zk circuit in a proving mode, and all account updates created within your method (implicitly) are going to have the proof of execution attached to them
    await tx.prove();

    // sends the tx, which is just a bunch of account updates to the L1, the L1 looks at the account updates and sees they are authorized by a proof, so it verifies the proof - if its valid the account updates are applied on the L1 state and you can see the results of your contract execution
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
