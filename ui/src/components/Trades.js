import { useEffect, useState } from 'react'
import { request, gql } from 'graphql-request'
import Link from 'next/link';

const Trades = ({ address }) => {
  const [trades, setTrades] = useState([])

  useEffect(() => {
    if (address) {
      const fetchTrades = async () => {
        const endpoint = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
        
        const query = gql` 
        {
            swaps(where: {recipient: "0xaecc64a55d46551e410d3875201e9b8cd63827eb"}) {
              transaction {
                id
                blockNumber
                timestamp
              }
              sender
              pool {
                token0 {
                  symbol
                }
                token1 {
                  symbol
                }
              }
              amount0
              amount1
            }
          }
        `

        const data = await request(endpoint, query)
        setTrades(data.swaps)
      }
      fetchTrades()
    }
  }, [address])

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-900">
  <div className="max-w-md mx-auto bg-gray-700 text-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3 p-3">
          {trades.length ? trades.map((trade, index) => {
              let tokenBought, tokenPaid;
              if(trade.amount0 < 0) {
                tokenBought = `${Math.abs(trade.amount0)} ${trade.pool.token0.symbol}`;
                tokenPaid = `${trade.amount1} ${trade.pool.token1.symbol}`;
              } else {
                tokenBought = `${Math.abs(trade.amount1)} ${trade.pool.token1.symbol}`;
                tokenPaid = `${trade.amount0} ${trade.pool.token0.symbol}`;
              }
              return (
                <div key={trade.transaction.id} className="m-4 p-2 rounded border border-gray-700 bg-gray-700 hover:gradient-bg overflow-hidden sm:overflow-auto break-all transition-colors duration-500">
                <Link href={`/GenerateProof`}>
                    <div className="block gradient-text">
                      <div className="px-4 py-2">
                          <h2 className="font-bold text-lg">Transaction: {trade.transaction.id}</h2>
                          <p>Block Number: {trade.transaction.blockNumber}</p>
                          <p>Timestamp: {new Date(trade.transaction.timestamp * 1000).toLocaleString()}</p>
                          <p>Swapped by: {trade.sender}</p>
                          <p>Pair: {trade.pool.token0.symbol} / {trade.pool.token1.symbol}</p>
                          <p>Bought: {tokenBought} <br /> Paid: {tokenPaid}</p>
                      </div>
                    </div>
                </Link>
              </div>
              );
          }) :  <p className="m-3">No trades found</p>
          }
      </div>
    </div>
  )
}

export default Trades
