import { useEffect, useRef, useState } from 'react';
import './reactCOIServiceWorker';
import ZkappWorkerClient from './zkappWorkerClient';
import { PublicKey, Field, PrivateKey } from 'snarkyjs';
import QRCode from 'qrcode';

let transactionFee = 0.1;

export default function GenerateProof() {
  const [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
  });
  const [imageData, setImageData] = useState(null);
  const imgRef = useRef(null);
  const transactionHash = "0x07aac1d5997e4cb1c6bd88b15ab4500ef7dfe0b70919fdb69da62d9398e0b7bf"
  const copyImageToClipboard = () => {
    const imageUrl = imgRef.current.src;
    const newWindow = window.open();
    newWindow.document.write('<img src="' + imageUrl + '">');
  }
  
  const privateKey = PrivateKey.fromBase58(
    process.env.PRIVATE_KEY ??
      "EKDm39kzoTsvr1rdyNu3nmEkFY5w2xT4Ut1er1zuuoaqAMWVeoAY"
  );

  const [displayText, setDisplayText] = useState('');
  const [transactionlink, setTransactionLink] = useState('');

  // -------------------------------------------------------
  // Do Setup

  useEffect(() => {
    async function timeout(seconds: number): Promise<void> {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, seconds * 1000);
      });
    }

    (async () => {
      if (!state.hasBeenSetup) {
        setDisplayText('Loading web worker...');
        console.log('Loading web worker...');
        const zkappWorkerClient = new ZkappWorkerClient();
        await timeout(5);

        setDisplayText('Done loading web worker');
        console.log('Done loading web worker');

        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = (window as any).mina;

        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }

        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);

        console.log(`Using key:${publicKey.toBase58()}`);
        setDisplayText(`Using key:${publicKey.toBase58()}`);

        setDisplayText('Checking if fee payer account exists...');
        console.log('Checking if fee payer account exists...');

        const res = await zkappWorkerClient.fetchAccount({
          publicKey: publicKey!,
        });
        const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();

        console.log('Compiling zkApp...');
        setDisplayText('Compiling zkApp...');
        await zkappWorkerClient.compileContract();
        console.log('zkApp compiled');
        setDisplayText('zkApp compiled...');

        const zkappPublicKey = PublicKey.fromBase58(
          'B62qqFqt2cYqF6AAEyDRXnj13YvhtYkYFfeNtGD4Zwx9kuQqp1W9G6T'
        );

        await zkappWorkerClient.initZkappInstance(zkappPublicKey);
        console.log("verifying")
        await zkappWorkerClient.verify(zkappPublicKey);


        console.log('Getting zkApp state...');
        setDisplayText('Getting zkApp state...');
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
        setDisplayText('');

        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
          zkappPublicKey,
          accountExists,
        });
      }
    })();
  }, []);

  // -------------------------------------------------------
  // Wait for account to exist, if it didn't

  useEffect(() => {
    (async () => {
      if (state.hasBeenSetup && !state.accountExists) {
        for (;;) {
          setDisplayText('Checking if fee payer account exists...');
          console.log('Checking if fee payer account exists...');
          const res = await state.zkappWorkerClient!.fetchAccount({
            publicKey: state.publicKey!,
          });
          const accountExists = res.error == null;
          if (accountExists) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        setState({ ...state, accountExists: true });
      }
    })();
  }, [state.hasBeenSetup]);

  // -------------------------------------------------------
  // Send a transaction

  const onSendTransaction = async () => {
    setState({ ...state, creatingTransaction: true });

    setDisplayText('Creating a transaction...');
    console.log('Creating a transaction...');

    await state.zkappWorkerClient!.fetchAccount({
      publicKey: state.publicKey!,
    });

    setDisplayText('Creating proof...');
    console.log('Creating proof...');
    await state.zkappWorkerClient!.proveUpdateTransaction();

    console.log('Requesting send transaction...');
    setDisplayText('Requesting send transaction...');
    const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();
    console.log(transactionJSON)

    setDisplayText('Getting transaction JSON...');
    console.log('Getting transaction JSON...');
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: '',
      },
    });

    const transactionLink = `https://berkeley.minaexplorer.com/transaction/${hash}`;
    console.log(`View transaction at ${transactionLink}`);

    setTransactionLink(transactionLink);
    setDisplayText(transactionLink);

    setState({ ...state, creatingTransaction: false });

  

  };

  useEffect(() => {
    const getZkProofImage = async () => {
        if (!transactionHash) return;
        try {
            const url = await QRCode.toDataURL(transactionHash);
            setImageData(url);
        } catch (err) {
            console.log('Error generating QR code', err);
        }
    }
    getZkProofImage();
}, [transactionHash]);

  // -------------------------------------------------------
  // Refresh the current state

 
  // -------------------------------------------------------
  // Create UI elements

  let hasWallet;
  if (state.hasWallet != null && !state.hasWallet) {
    const auroLink = 'https://www.aurowallet.com/';
    const auroLinkElem = (
      <a href={auroLink} target="_blank" rel="noreferrer">
        [Link]{' '}
      </a>
    );
    hasWallet = (
      <div>
        Could not find a wallet. Install Auro wallet here: {auroLinkElem}
      </div>
    );
  }

  const stepDisplay = transactionlink ? (
    <a href={displayText} target="_blank" rel="noreferrer">
      View transaction
    </a>
  ) : (
    displayText
  );

  let setup = (
    <div
     
      style={{ fontWeight: 'bold', fontSize: '1.5rem', paddingBottom: '5rem' }}
    >
      {stepDisplay}
      {hasWallet}
    </div>
  );

  let accountDoesNotExist;
  if (state.hasBeenSetup && !state.accountExists) {
    const faucetLink =
      'https://faucet.minaprotocol.com/?address=' + state.publicKey!.toBase58();
    accountDoesNotExist = (
      <div>
        Account does not exist. Please visit the faucet to fund this account
        <a href={faucetLink} target="_blank" rel="noreferrer">
          [Link]{' '}
        </a>
      </div>
    );
  }

  

  let mainContent;
  if (state.hasBeenSetup && state.accountExists) {
    mainContent = (
      <div style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ padding: 0 }}>
          {imageData && 
            <div>
              <img ref={imgRef} src={imageData} alt='Proof image with QR code' />
              <button onClick={copyImageToClipboard}>Copy Image</button>
            </div>
          }
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-6 max-w-sm mx-auto bg-gray-800 rounded-xl shadow-md flex items-center space-x-4">
        <div className="flex-shrink-0">
          {setup}
          {accountDoesNotExist}
          {mainContent}
        </div>
      </div>
    </div>
  );
}
