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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3 p-3">
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
            <div key={trade.transaction.id} className="m-4 p-2 rounded bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 overflow-hidden sm:overflow-auto break-all">
        <Link href={`/generate-proof/${trade.transaction.id}`}>
                    <div className="block hover:text-white">
                        <div className="px-4 py-2">
                            <h2 className="font-bold text-lg">Transaction: {trade.transaction.id}</h2>
                            <p className="text-sm">Block Number: {trade.transaction.blockNumber}</p>
                            <p className="text-sm">Timestamp: {new Date(trade.transaction.timestamp * 1000).toLocaleString()}</p>
                            <p className="text-sm">Swapped by: {trade.sender}</p>
                            <p className="text-sm">Pair: {trade.pool.token0.symbol} / {trade.pool.token1.symbol}</p>
                            <p className="text-sm">Bought: {tokenBought} <br /> Paid: {tokenPaid}</p>
                        </div>
                    </div>
                </Link>
            </div>
        );
        }) :  <p className="m-3">No trades found</p>
      }
    </div>
  )
  
}

export default Trades
