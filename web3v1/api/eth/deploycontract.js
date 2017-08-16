const Web3 = require('web3');
const fs = require('fs');

//const RPC_HOST = "http://localhost:8545";
const RPC_HOST ="https://rinkeby.infura.io";

const web3 = new Web3(new Web3.providers.HttpProvider(RPC_HOST));

var privateKey = "0x";

//create an empty callet
web3.eth.accounts.wallet.create(0);

//add an account
web3.eth.accounts.wallet.add(privateKey);

let abi = JSON.parse(fs.readFileSync('Token_abi.json').toString());
let bytecode = fs.readFileSync('Token_bytecode.txt').toString();

let myContract = new web3.eth.Contract(abi);

web3.eth.getBalance(web3.eth.accounts.wallet[0].address).then(bal=>console.log("balance",bal))


//https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#deploy
//send an unsigned transaction. only works on testrpc
function deployContractUnsigned(contractInstance, bytecode, contractArgs){
    return contractInstance.deploy({data:bytecode, arguments:contractArgs})
    .send({
        from: ADDRESS,
        gas: 1500000,
        gasPrice: '30000000000000'
    })
    .on('error', (error) => {console.log(2,error)})
    .on('transactionHash', (transactionHash) => { console.log(3,transactionHash) })
    .on('receipt', (receipt) => {
    console.log(4, receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', (confirmationNumber, receipt) => { console.log(5,confirmationNumber) })
    .then((newContractInstance) => {
        console.log(6) // instance with the new contract address
    });
}


//send a signed transaction
function deployContract(contractInstance, bytecode, contractArgs){
    let transaction_data = contractInstance.deploy({data:bytecode, arguments:contractArgs}).encodeABI();
    return web3.eth.sendTransaction({from: 0, data: transaction_data,
    //        gasPrice: web3.eth.gasPrice, //default: web3.eth.gasPrice
            gas: 4000000
    })
    .on('error', (error) => {console.log(error)})
    .on('transactionHash', (transactionHash) => { console.log("transaction hash",transactionHash) })
    .on('receipt', (receipt) => {
    console.log("contract address", receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', (confirmationNumber, receipt) => { console.log("confirmation number",confirmationNumber) })
    .then((newContractInstance) => {
        console.log("new contract instance ready") // instance with the new contract address
    });
}

deployContract(myContract, bytecode, []);