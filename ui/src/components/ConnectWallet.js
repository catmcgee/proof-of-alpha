import React, { useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
const ethers = require("ethers");

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
        <div className="min-h-screen min-w-screen flex items-center justify-center">
            <button  
                onClick={connectWallet}
                className='py-2 px-4 animate-gradient bg-gradient-to-r from-purple-800 to-blue-700 text-white text-sm font-semibold rounded-full shadow-md hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-500'>
                Connect Wallet
            </button>
        </div>
    );
}

export default ConnectWallet;
