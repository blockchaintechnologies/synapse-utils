const Web3 = require('web3');
//const web3 = new Web3();
const fs = require('fs');
//const solc = require('solc');
const RPC_HOST = "http://localhost:8545";

const web3 = new Web3(new Web3.providers.HttpProvider(RPC_HOST));
const ADDRESS="0xe728a0db5aee26fab4e3ea18819fda9329dab100";
const CONTRACT_NAME = "DelphiToken";

let abi = JSON.parse(fs.readFileSync(CONTRACT_NAME+'_abi.json').toString());
let bytecode = fs.readFileSync(CONTRACT_NAME+'_bytecode.txt').toString();

let myContract = new web3.eth.Contract(abi);

//https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#deploy
myContract.deploy({data:bytecode, arguments:[]})
.send({
    from: ADDRESS,
    gas: 1500000,
    gasPrice: '30000000000000'
}, function(error, transactionHash){console.log(1,error,transactionHash)})
.on('error', function(error){console.log(2,error)})
.on('transactionHash', function(transactionHash){ console.log(3,transactionHash) })
.on('receipt', function(receipt){
   console.log(4) // contains the new contract address
})
.on('confirmation', function(confirmationNumber, receipt){ console.log(5,confirmationNumber) })
.then(function(newContractInstance){
    console.log(6) // instance with the new contract address
});

