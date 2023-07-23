import { useEffect, useState } from 'react';
import Link from 'next/link';

const Trades = ({ address }) => {

  // Dummy Data
  const dummyTransactions = [
    { id: "0x123456789", blockNumber: 123456, timestamp: 1673841092384, sender: "0xSender1", token0: "ETH", token1: "DAI", amount0: -0.2, amount1: 200 },
    { id: "0x234567890", blockNumber: 234567, timestamp: 1673842092384, sender: "0xSender2", token0: "ETH", token1: "DAI", amount0: -0.1, amount1: 100 },
    { id: "0x345678901", blockNumber: 345678, timestamp: 1673843092384, sender: "0xSender3", token0: "ETH", token1: "DAI", amount0: -0.5, amount1: 500 },
    { id: "0x456789012", blockNumber: 456789, timestamp: 1673844092384, sender: "0xSender4", token0: "ETH", token1: "DAI", amount0: -0.3, amount1: 300 },
    { id: "0x567890123", blockNumber: 567890, timestamp: 1673845092384, sender: "0xSender5", token0: "ETH", token1: "DAI", amount0: -0.4, amount1: 400 }
  ];

  const [trades, setTrades] = useState(dummyTransactions);

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-900">
      <div className="w-full md:max-w-5xl mx-auto bg-gray-700 text-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3 p-3">
        {trades.length ? trades.map((trade, index) => {
            let tokenBought, tokenPaid;
            if(trade.amount0 < 0) {
              tokenBought = `${Math.abs(trade.amount0)} ${trade.token0}`;
              tokenPaid = `${trade.amount1} ${trade.token1}`;
            } else {
              tokenBought = `${Math.abs(trade.amount1)} ${trade.token1}`;
              tokenPaid = `${trade.amount0} ${trade.token0}`;
            }
            return (
              <div key={trade.id} className="m-4 p-2 rounded border border-gray-700 bg-gray-700 hover:bg-purple-600 overflow-hidden sm:overflow-auto break-all transition-colors duration-500">
                <Link href={`/GenerateProof`}>
                  <div className="block gradient-text">
                    <div className="px-4 py-2">
                        <h2 className="font-bold text-xl">Transaction: {trade.id}</h2>
                        <p className="text-lg">Block Number: {trade.blockNumber}</p>
                        <p className="text-lg">Timestamp: {new Date(trade.timestamp * 1000).toLocaleString()}</p>
                        <p className="text-lg">Swapped by: {trade.sender}</p>
                        <p className="text-lg">Pair: {trade.token0} / {trade.token1}</p>
                        <p className="text-lg font-bold">Bought: {tokenBought} <br /> Paid: {tokenPaid}</p>
                    </div>
                  </div>
                </Link>
              </div>
            );
        }) :  <p className="m-3">No trades found</p>
        }
      </div>
    </div>
  );
}

export default Trades;
