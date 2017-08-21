const Web3 = require('web3');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync("config.js").toString());

const RPC_HOST = config.network;
//const RPC_HOST = "http://localhost:8545";

const web3 = new Web3(new Web3.providers.HttpProvider(RPC_HOST));

let privateKey =  config.account.privatekey;

//create an empty callet
web3.eth.accounts.wallet.create(0);

//add an account
web3.eth.accounts.wallet.add(privateKey);

let abi = JSON.parse(fs.readFileSync('Token_abi.json').toString());
let bytecode = fs.readFileSync('Token_bytecode.txt').toString();

let myContract = new web3.eth.Contract(abi);

//web3.eth.getBalance(web3.eth.accounts.wallet[0].address).then(bal=>console.log("balance",bal))

//https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#deploy
//send a signed transaction
function deployContract(contractInstance, bytecode, contractArgs){
    let transaction_data = contractInstance.deploy({data:bytecode, arguments:contractArgs}).encodeABI();
    return web3.eth.sendTransaction({from: 0, data: "0x"+transaction_data,
    //        gasPrice: web3.eth.gasPrice, //default: web3.eth.gasPrice
            gas: 4000000
    })
    .on('error', (error) => {console.log(error)})
    .on('transactionHash', (transactionHash) => { console.log("transaction hash",transactionHash) })
    .on('receipt', (receipt) => {
    console.log("contract address", receipt.contractAddress) // contains the new contract address
    })
//    .on('confirmation', (confirmationNumber, receipt) => { console.log("confirmation number",confirmationNumber) })
}
//they both work ¯\_(ツ)_/¯
function deployContract2(contractInstance, bytecode, contractArgs){
    //does not actually return a new contract instance :(
    return contractInstance.deploy({data:"0x"+bytecode, arguments:contractArgs})
    .send({
        from: myAddr,
        gas: 1500000,
//        gasPrice: '30000000000000'
    })
    .once('error', (error) => {console.log(2,error)})
    .once('transactionHash', (transactionHash) => { console.log(3,transactionHash) })
    .once('receipt', (receipt) => {
        console.log(4, receipt.contractAddress) // contains the new contract address
    })
}

const myAddr = web3.eth.accounts.wallet[0].address; 

deployContract2(myContract, bytecode, [])
.then((receipt)=>{
    myContract.options.address = receipt.contractAddress;
    return myContract.methods.mintToken(myAddr,1000).send({from:myAddr, gas:4000000})
})
//.on ("error", console.log)
.then((receipt)=>{
    return myContract.methods.balanceOf(myAddr).call({from:myAddr});
}).then(console.log)