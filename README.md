
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/catmcgee/proof-of-alpha">
    <img src="https://github.com/catmcgee/proof-of-alpha/blob/main/ui/public/assets/logo.png" alt="Logo">
  </a>

<h3 align="center">Proof of Alpha</h3>

  <p align="left">
    Prove and showcase your successful trades without revealing sensitive information such as your wallet address. Built on Mina Protocol using SnarkyJS for ZKPs.
    <br />
    Built for ETHGlobal Paris! <br/>
    <a href="https://docs.google.com/presentation/d/1dk6KsOSz2_XO5CZJDQFQrW_DXz9AOLAkXFf386TlXv4/edit?usp=sharing">View Deck</a>
  </p>
</div>


<!-- ABOUT THE PROJECT -->
## About The Project

This project combines privacy and trustlessness in order to build a decentralized future that a billion users will want to join.

The influencer economy is valued at over $22 billion, with trading & crypto influencers making 10% of this. However, this entire industry is built on guesses, trusts, and easily fabricated screenshots. People don't want to reveal their wallet address because it gives away their entire blockchain identity and opens them up to even more scams. So we rely on what they say.

Proof of Alpha allows anyone to prove their on-chain and off-chain trades and swaps and generates a QR code for anyone to easily verify the claim. It is made for web2 & web3 natives, and doesn't even need to stop at crypto. Currently it works with Uniswap but we will add 1inch, AAVE, and cefi such as Binance very soon.


### Built With

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* Lens
* Sismo
* Polygon
 
 ### How It Works
1. The user logs in with WalletConnect to select any wallet with trades they would like to prove
2. Proof of Alpha fetches their trades using The Graph (currently Uniswap)
3. They see their trades on the screen and can select them to generate a proof 
4. When selected, the transaction information is sent to a ZK oracle to compare with on-chain data also taken from The Graph or other sources
5. If the transaction data matches up, a signature is created and ZK proof generated with Mina SnarkyJS. This all happens in the browser to keep privacy
6. The ZK proof is put onto the Mina blockchain
7. A QR code is generated to allow the user to post it anywhere irl or virtual so that their trade can be verified
8. The QR code fills in the verification ID taken from Mina after the ZK proof was generated, and checks with the blockchain to verify the proof

<!-- GETTING STARTED -->

### Prerequisites

* node
* npm

### Run
* Build the contracts
```cd contracts && npm run build```
* Run the oracle (you should have this running when you run the UI)
```cd oracle & node index.js```
* Run the client side
```cd ui && npm run dev```
* Deploy smart contracts
```cd contracts && zk config```

Find more information in the [contracts repo](https://github.com/catmcgee/proof-of-alpha/tree/main/contracts) and [UI repo](https://github.com/catmcgee/proof-of-alpha/tree/main/ui).

<p align="right">(<a href="#readme-top">back to top</a>)</p>
