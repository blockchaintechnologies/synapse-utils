
config.js

leverage account wrapper, accounts.js

build config.js by parsing solidity contracts for constructor arguments, imports
augment deploy.js to parse config.js to deploy contracts in order of dependency, supply 
requisite constructor args, output abi, bytecode, contract address

config.js
    contracts
        dep1.sol
            args
                address(solidity data type) param1
                bytes32 param2
                ...
        dep2.sol
    account:
        privatekey
        passphrase
        network ( empty if not holding ether)
    network:
        network(to deploy on)    

-----

contract_crud.js

write scripts to record saved contracts to sql db according to schema 
provided

----

accounts.js

add any useful functionality ( like getPubKey )
