import { Mina, PublicKey, fetchAccount } from 'snarkyjs';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { IncrementSecret } from '../../../contracts/src/IncrementSecret';

const state = {
IncrementSecret: null as null | typeof IncrementSecret,
  zkapp: null as null | IncrementSecret,
  transaction: null as null | Transaction,
};

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
    const { IncrementSecret } = await import('../../../contracts/build/src/IncrementSecret.js');
    state.IncrementSecret = IncrementSecret;
  },
  compileContract: async (args: {}) => {
    await state.IncrementSecret!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.IncrementSecret!(publicKey);
  },
  getNum: async (args: {}) => {
    const currentNum = await state.zkapp!.x.get();
    return JSON.stringify(currentNum.toJSON());
  },
 
//   proveUpdateTransaction: async (args: {}) => {
//     await state.transaction!.prove();
//   },
//   getTransactionJSON: async (args: {}) => {
//     return state.transaction!.toJSON();
//   },
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
