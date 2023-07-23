import { useState } from 'react';
import ConnectWallet from '../components/ConnectWallet';
import Trades from '../components/Trades';

const Home = () => {
  const [address, setAddress] = useState('');

  return (
    <div className="min-h-screen">
      <div className="flex iteåms-center justify-center h-full">
        {!address && <ConnectWallet setAddress={setAddress} />}
      </div>
      {address && <Trades address={address} />}
    </div>
  );
}

export default Home;
