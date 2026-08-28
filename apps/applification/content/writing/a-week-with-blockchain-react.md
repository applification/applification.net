---
title: A week with blockchain & react
date: '2017-12-13'
updated: '2022-02-13'
type: post
summary: What is the blockchain?
topics:
  - react
featured: false
draft: false
slug: a-week-with-blockchain-react
legacyId: '12'
---
> TLDR =\> I recently had a bit of spare time on my hands and took the opportunity to learn about the blockchain. It sounded so complex but I wanted to find out what the blockchain really is and how I could use React to build front-end UI on the blockchain. This is a summary of answers to the questions I asked myself along the way and a quick-start guide into building UI in React on Ethereum.

*Note: This is only covers a small fraction of the blockchain, a week ago I knew nothing about the blockchain at all, so if I’ve got anything wrong, please let me know!*

#### So… what is the blockchain?

The blockchain is like a **distributed memory** where everyone knows the same information, this is opposed to a **centralised memory** where you place all your trust and information in say a bank or a lawyer or government.

Let’s look at the bank example, today we place trust in banks that log every transaction you make in a single place, their organisation. Compare that to a decentralised banking system where every transaction you make is logged by everyone in the blockchain. This means that the first block of transactions aka the ‘Genesis block’ for Bitcoin is still around 9 years after and will be forever. You can’t say the same about paper receipts.

#### What are these tokens and coins then?

A token and a coin are one and the same thing. Blockchain has a finite amount of tokens/coins, so unlike in the physical world where governments can print more money, once it’s out, it’s really out. Each of these tokens has a certain value associated with it and that is determined by the market and how it’s useful beyond storing monetary value.

What gives these tokens/coins special powers is the technology that runs in the background which is called blockchains (the system/rules that determine the utility of these tokens). At its core, blockchain is a way for people to prove ownership and trustfully transact using tokens.

#### What is Bitcoin?

**[Bitcoin - Open source P2P money](https://bitcoin.org/en/)**  
*[Bitcoin is an innovative payment network and a new kind of money. Find all you need to know and get started with…](https://bitcoin.org/en/)*[bitcoin.org](https://bitcoin.org/en/)

Bitcoin uses peer-to-peer technology to operate with no central authority or banks; managing transactions and the issuing of bitcoins is carried out collectively by the network. Bitcoin is open-source; its design is public, nobody owns or controls Bitcoin.

Bitcoin is built upon the blockchain, tokens are named coins instead and you can use Bitcoin to send and receive digital money using a persons wallet token. Whilst Bitcoin is limited to CryptoCurrency, the blockchain is not.

#### Are the blockchain and CryptoCurrencies a scam?

Not at all. After 9 years Bitcoin has proven the concept of using the blockchain and CryptoCurrency. I personal see CryptoCurrency as the natural evolution of money, it will come, we just can’t say whether the winner will be Bitcoin or some other CryptoCurrency.

#### What makes bitcoin valuable?

Money is not coins and banknotes, money has been created many times and in many different ways. Money is anything people are willing to use in order to represent systematically the value of other things for the purpose of exchanging goods and services. Cultures have prospered using shells, cattle, grain and promissory notes but the most familiar is the coin. Even today more than 90% of money exists only on computer servers. In every case money is purely a mental revolution. It involves the creation of a new conscious reality that exists solely in people’s shared imagination.

What makes a token/coin valuable is simply whether we as a culture believe in it and agree this is something that we want and is of value. As long as people are willing to trade goods and services in exchange for electronic data then there is value and perhaps even greater value than coins and notes as its lighter, less bulky and easier to keep track of.

#### What are the problems with Bitcoin?

Whilst as of today (Dec 2017) there is perceived value in Bitcoin with a market value of $17.5k, it is not without problems. It has been criticised for the amount of electricity required to mine coins, it’s been subjected to criminal activity, whilst there are scaling problems it needs to overcome which are impacting transaction processing speed and fees.

These problems are not unique to Bitcoin. For a more detailed look at the problems facing Blockchains I recommend [Preethi Kasireddy](https://medium.com/u/d446dafbe292)’s article on the “fundamental challenges with public blockchains”.

**[Fundamental challenges with public blockchains](https://medium.com/@preethikasireddy/fundamental-challenges-with-public-blockchains-253c800e9428)**  
*[There’s no question that blockchain technology has enormous ](https://medium.com/@preethikasireddy/fundamental-challenges-with-public-blockchains-253c800e9428)**[potential.](http://potential.medium.com)*[medium.com](http://potential.medium.com)

#### Can the blockchain do more than just digital currency?

Sure! Bitcoin is focused on Cryptocurrency but other Blockchains specialise in other areas, whilst Ethereum allows running your own code on the blockchain.

#### What the heck is Ethereum?

**[Ethereum Project](https://www.ethereum.org/)**  
*[Ethereum is a decentralized platform that runs smart contracts: applications that run exactly as programmed without any…](https://www.ethereum.org/)*[www.ethereum.org](https://www.ethereum.org/)

Like Bitcoin, Ethereum is also built on the blockchain but is a decentralised platform that runs smart contracts. Smart contracts are simply applications that run exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference.

So rather being a simple ledger that everyone holds to track monetary transactions, Ethereum upgrades your ledger to a virtual machine (VM) where smart contracts can be deployed and any code can be run. When a smart contract is deployed on the blockchain it is called a dapp.

#### A dapp?

A traditional app has backend code running on centralised servers but a dapp has its backend code running on a decentralised peer-to-peer network. The app is spread across the entire blockchain in a distributed manner. So a dapp is simply a distributed app as opposed to a centralised app.

**CryptoKitties **  
One of the first examples of a dapp is CryptoKitties.

**[CryptoKitties | Collect and breed digital cats!](https://www.cryptokitties.co/)**  
*[Collect and trade CryptoKitties in one of the world's first blockchain games. Breed your rarest cats to create the…](https://www.cryptokitties.co/)*[www.cryptokitties.co](https://www.cryptokitties.co/)

CryptoKitties is a game centred around breed-able, collectable creatures called CryptoKitties! Each cat is one-of-a-kind and 100% owned by you; it cannot be replicated, taken away, or destroyed. Whilst a bit of fun CryptoKitties highlights a number of the key properties of a dapps and enables us to get a fun understanding of how they work. Though there has been some [discussion over whether CryptoKitties is actually a true dapp](https://www.coindesk.com/scratch-cryptokitties-isnt-ethereums-vision-apps/)!

#### Can I write my own dapps?

Absolutely, Ethereum like most technologies is quite easy to get up and running with a sample app. However, actually writing secure smart contracts is complex and a skill that takes time and extensive blockchain knowledge.

#### How do I install Ethereum?

I’d recommend using the Ethereum CLI, instructions on [ethereum.org](http://ethereum.org).

**[Install the Command Line Tools](https://www.ethereum.org/cli)**  
*[These are tools for blockchain developers. The command line tools will allow you to connect your server to or run your…](https://www.ethereum.org/cli)*[www.ethereum.org](https://www.ethereum.org/cli)

As quick guide, the following commands will install Ethereum, set up a new account with Geth and init a basic web project with some test accounts.

#### What are all these different Blockchain Environments?

It’s important to note that Ethereum has several blockchain environments. In the code above we used testrpc which is simply a development environment, of which there are many options.

If you wanted to run your code on an actual blockchain you would use **Testnet (aka Ropsten) **which you can think of this like a* QA or Staging Server that* you can deploy to before using the *Production* blockchain which is **Mainnet (aka Homestead)**.

**[ethereum/ropsten](https://github.com/ethereum/ropsten)**  
*[ropsten - Ropsten public testnet PoW ](https://github.com/ethereum/ropsten)**[chain](http://chaingithub.com)*[github.com](http://chaingithub.com)

If you are using anything other than a development blockchain you will notice that the blockchain is slow and a blockchain is only going to get slower as it grows! I found that an initial download of the Ropsten blockchain took me 3–4 days and weighed in at around 30gb.

#### What is an Ethereum Wallet?

The [Ethereum Wallet](https://www.ethereum.org/) is a gateway to decentralized applications on the Ethereum blockchain. It allows you to hold and secure Ether and other crypto-assets built on Ethereum, as well as write, deploy and use smart contracts.

If you want to test on the Ropsten blockchain, you need digital currency for that blockchain, you can either mine this (which takes a long time) or [ask for some from kind leader within the blockchain](https://www.reddit.com/r/ethdev/comments/72ltwj/the_new_if_you_need_some_ropsten_testnet_ethers/). You store these coins in your digital wallet.

### How can I buy coins?

Coin exchanges, of which there are a few to choose from. The easiest and most popular is probably Coinbase which will allow you to link a [fiat bank account](https://en.m.wikipedia.org/wiki/Fiat_money) to buy and sell Bitcoin and Ethereum.

**[Coinbase - Buy/Sell Digital Currency](https://www.coinbase.com/)**  
*[Coinbase is a secure online platform for buying, selling, transferring, and storing digital ](https://www.coinbase.com/)**[currency.](http://currency.www.coinbase.com)*[www.coinbase.com](http://currency.www.coinbase.com)

#### What the heck is Gas?

This was one of the stranger concepts! In short, it costs money to interact with the blockchain. This money goes to miners who do all the work to include your code in the blockchain. You have to specify how much money you are willing to pay to get your code included in the blockchain and you do that by setting the value of ‘gas’. The Ether balance in your ‘from’ account will be used to buy gas. The price of gas is set by the network.

This is all quite unsettling because it’s like a tax but you don’t know what the exact cost of that tax is going to be until your transaction is complete.

The good news is there are two types of interaction with a blockchain. Whilst a Transaction is a write operation and has Gas charges associated, a Call is a read only operation which is free.

#### How do I write Smart Contracts?

Solidity is a new language for smart contracts built on the blockchain. It is a statically-typed language, meaning data types like strings, integers, and arrays must be defined.

Solidity has a unique type called an address. Addresses are Ethereum addresses, stored as 20-byte values. Every account and smart contract on the Ethereum blockchain has an address and can send and receive Ether to and from this address.

Solidity is a bit like JavaScript but must be compiled to bytecode in order to run on the blockchain. When compiled an interface is also created called **abi** (Application Binary Interface) which tells the contract user what methods are available in the contract.

**[Application Binary Interface Specification - Solidity 0.4.20 documentation](https://solidity.readthedocs.io/en/develop/abi-spec.html)**  
*[The Application Binary Interface is the standard way to interact with contracts in the Ethereum ecosystem, both from…](https://solidity.readthedocs.io/en/develop/abi-spec.html)*[solidity.readthedocs.io](https://solidity.readthedocs.io/en/develop/abi-spec.html)

#### **How does front-end UI communicate with the blockchain?**

Web3 is a JavaScript library which lets you interact with the blockchain through RPC (Remote Procedure Call). In distributed computing, an RPC is when a computer program causes a procedure (subroutine) to execute in a different address space (commonly another computer) which is coded as if it were a normal (local) procedure call.

#### This is getting silly, are there any frameworks to help?

Yup, use theTruffle Framework!

> Truffle is a development environment, testing framework and asset pipeline for Ethereum, which aims to make life as an Ethereum developer easier.

You can think of Truffle as a little like create-react-app magically setting up the core architecture of your app in an opinionated way. It creates a project that has your solidity contracts, web3js, tests and blockchain deployment scripts all ready for you to build upon.

**What are Truffle Boxes?**  
Truffle Boxes are helpful boilerplates that allow you to focus on what makes your dapp unique. Truffle Boxes can contain other helpful modules, Solidity contracts & libraries, front-end views and more; all the way up to complete example dapps.

**[Truffle Boxes | Truffle Suite](http://truffleframework.com/boxes/)**  
*[Our official boxes come from the developers at Truffle. This first set of boxes is aimed at integration with the React…](http://truffleframework.com/boxes/)*[truffleframework.com](http://truffleframework.com/boxes/)

#### Is there a React Truffle Box?

Yes there is :-)

**[react Box | Truffle Suite](http://truffleframework.com/boxes/react)**  
*[Your Ethereum Swiss Army ](http://truffleframework.com/boxes/react)**[Knife](http://Knifetruffleframework.com)*[truffleframework.com](http://Knifetruffleframework.com)

Unboxing the React Truffle Box provides you with a React based Ethereum Smart Contract. There are [other React boxes available](https://truffle-box.github.io/) too for Redux and UPort. Below is a set of quick-start instructions to get your React Smart Contract up and running.

#### Where do I store my media files in a distributed system?

There are options, two of the best known are Swarm and IPFS.

> [Swarm is a distributed storage platform and content distribution service](https://blog.ethereum.org/2016/12/15/swarm-alpha-public-pilot-basics-swarm/), a native base layer service of the ethereum web3 stack. The primary objective of Swarm is to provide a decentralized and redundant store for dapp code and data as well as block chain and state data.

**[Swarm](https://ethersphere.github.io/swarm-home/)**  
*[Serverless hosting incentivised peer-to-peer storage and content ](https://ethersphere.github.io/swarm-home/)**[distribution](http://distributionethersphere.github.io)*[ethersphere.github.io](http://distributionethersphere.github.io)

IPFS aims to replace HTTP and build a better web for all of us.

**[IPFS is the Distributed Web](https://ipfs.io/)**  
*[A peer-to-peer hypermedia protocol to make the web faster, safer, and more ](https://ipfs.io/)**[open.](http://open.ipfs.io)*[ipfs.io](http://open.ipfs.io)

#### How can I see my blockchain transactions?

Etherscan is a Block Explorer and Analytics Platform for Ethereum. You can use a token to view the details of a specific transaction.

**[Ethereum BlockChain Explorer and Search](https://etherscan.io/)**  
*[The Ethereum BlockChain Explorer, API and Analytics ](https://etherscan.io/)**[Platform](http://Platformetherscan.io)*[etherscan.io](http://Platformetherscan.io)

---

#### Conclusion

There is no doubt the blockchain has a lot of new concepts and terminology that you need to get your around. But in reality the blockchain is not actually that complex, it’s just different to what we are used to.

Building UI on the blockchain in React should be similar to your normal React Web Apps, as long as you understand the theory of the blockchain and what is going on behind the scenes. The real complexity of the blockchain is in the writing of the Smart Contracts, how we make them secure, yet transparent and how we make it so blockchains can scale properly without eating up storage and energy.

Despite the [problems the blockchain still needs to overcome](https://medium.com/@preethikasireddy/fundamental-challenges-with-public-blockchains-253c800e9428), it could be the information ages biggest advancement since the internet. By enabling trustless transactions and empowering transparency, security and privacy, the technology holds immense potential for business and consumers alike. *It has the power for unprecedented social change.*
