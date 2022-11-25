const SHA256=require('crypto-js/sha256')
const EC=require('elliptic').ec
const ec=new EC('secp256k1')

class Transactions{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress=fromAddress
        this.toAddress=toAddress
        this.amount=amount
    }

    calculateHash(){
        return SHA256(
            this.fromAddress+
            this.toAddress+ 
            this.amount
        ).toString()
    }
    
    signTransaction(signingKey){
        const hashTX=this.calculateHash()
        const sig=signingKey.sign(hashTX,'base64')
        this.signature=sig.toDER('hex')
    }

    isTransactionValid(){
        if(this.fromAddress===null){
            return true
        }
        const publicKey=ec.keyFromPublic(this.fromAddress,'hex')
        return publicKey.verify(this.calculateHash(),this.signature)
    }
}
class Block{
    constructor(blockNumber,timestamp,transactions,previousHash=''){
        this.blockNumber=blockNumber
        this.timestamp=timestamp
        this.transactions=transactions
        this.previousHash=previousHash
        this.hash=this.calculateHash()
        this.blockNumber=0
        this.nonce=0
    }
    calculateHash(){
        return SHA256(
            this.timestamp+ 
            JSON.stringify(this.transactions)+
            this.previousHash+
            this.nonce
        ).toString()
    } 
    mineBlock(difficulty){
        while(
            this.hash.substring(0,difficulty)!==Array(difficulty+1).join('0')
        )
        this.nonce++
        this.hash=this.calculateHash()
        console.log('Block mined '+ this.hash)
    }
    hasTransactionValid(){
        for (const tx of this.transactions) {
           if(!tx.isTransactionValid()){
            return false
        }
        
    }
    return true    
    }
}

class BlockChain{
    constructor(){
        this.chain=[this.createGenesisBlock()]
        this.difficulty=0
        this.pendingTransactions=[]
        this.miningReward=100
    }
    createGenesisBlock(){
        return new Block(0,'1991/06/24','I was born','0')
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1]
    }
    addTransaction(transaction){
        if(!transaction.isTransactionValid()){
            throw Error("Cannot add invalid transaction to chain!!!")
        }

        this.pendingTransactions.push(transaction)
    }
    getBalanceOfAddress(address){
        let balance=0
        for (const block of this.chain) {
            for (const tx of block.transactions) {
               if(tx.fromAddress===address)balance-=tx.amount;
               if(tx.toAddress===address)balance+=tx.amount;
            }
        }
        return balance
    }
    // addBlock(newBlock){
    //     newBlock.previousHash=this.getLatestBlock().hash
    //     newBlock.mineBlock(this.difficulty)
    //     this.chain.push(newBlock)
    // }
    minePendingTransactions(minerAddress){
        const rewardTransaction=new Transactions(null,minerAddress,this.miningReward)
        this.pendingTransactions.push(rewardTransaction)
        let block = new Block(
            this.blockNumber,
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
            )
            block.mineBlock(this.difficulty)
            this.chain.push(block)
            this.pendingTransactions=[]
            block.blockNumber++
    }
    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock=this.chain[i];
            const previousBlock=this.chain[i-1];
            if(!currentBlock.hasTransactionValid()){
                return false;
            }
            if(currentBlock.hash!==currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash!==previousBlock.hash){
                return false;
            }
            if(currentBlock.blockNumber<=(this.chain.length-1)){
                return false;
            }    
        }
        return true; 
    }
}

module.exports={
    Block,
    BlockChain,
    Transactions
}