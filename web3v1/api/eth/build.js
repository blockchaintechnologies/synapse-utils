const fs = require('fs');
const solc = require('solc');

function compileContracts() {

    var input = {sources: {
        contract: fs.readFileSync(CONTRACT_NAME+'.sol').toString(),
    }};


    const output = solc.compile(input, 1);
    if (output.errors) {
        console.log(output.error);
    }

    var config = {contracts:[]};    

    for (var k in  output.contracts) {
        const contractKey = k.split(':').pop();
        const bytecode = output.contracts[k].bytecode;
        
        const abi = JSON.parse(output.contracts[k].interface);
        fs.writeFileSync(contractKey+"_c.json", JSON.stringify({bytecode:bytecode, abi:abi},null, 4), 'utf8');
        /*result[contractKey] = {
            bytecode: bytecode,
            abi: abi
        }*/
        let constructor = abi.find((e)=>{return e.type==="constructor"});
        config.contracts.push({[contractKey]:{args:(constructor?constructor.inputs:null)}})
    }
    return config;
}

const CONTRACT_NAME = "Token";
let config = compileContracts();
config.network="";
config.account = {privatekey:"0x", passphrase:"", network:""};
fs.writeFileSync("config.js", JSON.stringify(config, null, 4), 'utf8');

//console.log(compiledContracts)

//compiledContracts

//console.log(compiledContracts[CONTRACT_NAME]);