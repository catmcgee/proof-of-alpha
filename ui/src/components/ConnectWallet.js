import React, { useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

const ConnectWallet = ({ setAddress, address }) => {
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      network: "mainnet", 
      cacheProvider: true, 
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, 
          options: {
            infuraId: "41015b96fcbf4cda8b9e33e229fe85fe"
          }
        }
      }
    });

    const provider = await web3Modal.connect();
    await provider.enable();

    setProvider(new ethers.providers.Web3Provider(provider));
}

useEffect(() => {
  const setAddressFromProvider = async () => {
    if(provider) {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
    }
  }

  setAddressFromProvider();
}, [provider, setAddress]);


return (
    !address && 
    <div className="w-full flex justify-center items-center">
      <button onClick={connectWallet}
        className='w-max py-2 px-4 mr-auto bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-500'>
        Connect Wallet
      </button>
    </div>
  );
  
}

export default ConnectWallet;
