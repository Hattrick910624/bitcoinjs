const {Block,
    BlockChain,
    Transactions}= require ('./blockchain')

const EC=require('elliptic').ec
const ec=new EC('secp256k1')

myKey=ec.keyFromPrivate('040195936781045970871c918b9b7081d1f4dbfc7d30dd4f4c210629f4daa7c106ce4578e197318d955b5568d5bd5842c0c9ae6b35bb4da9db09723e2915e61e23')
myAddress=myKey.getPublic('hex')

let MyCoin=new BlockChain()
// console.log("Mining block 1 ...")
// MyCoin.addBlock(new Block(1,'2001/06/24','When I was 10'))
// console.log("Mining block 2 ...")
// MyCoin.addBlock(new Block(2,'2011/06/24','When I was 20'))
// console.log("Mining block 3 ...")
// MyCoin.addBlock(new Block(3,'2021/06/24','When I was 30'))

const tx=new Transactions(myAddress,'0x...',20)
tx.signTransaction(myKey)
MyCoin.addTransaction(tx)

MyCoin.minePendingTransactions(myAddress)

console.log('Balance of MyCoin is ',MyCoin.getBalanceOfAddress(myAddress))
console.log(MyCoin.isChainValid())
MyCoin.chain[1].transactions[0].toAddress='1Z...'
console.log(MyCoin.isChainValid())