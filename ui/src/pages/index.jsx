import { useState } from 'react';
import ConnectWallet from '../components/ConnectWallet';
import Trades from '../components/Trades';

const Home = () => {
  const [address, setAddress] = useState('');

  if(address) {
    return <Trades address={address} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-10 space-y-10">
      <h1 className="text-5xl font-bold text-center">PROOF<br /> OF ALPHA</h1>

      <img src="http://localhost:9000/assets/logo.png" alt="Placeholder" className="mx-auto w-72 h-72 object-cover rounded-full shadow-lg" />

      <p className="text-2xl text-gray-400 text-center">Show Your Trades, Not Your Identity</p>

      <ConnectWallet setAddress={setAddress} />
    </div>
  );
};

export default Home;
