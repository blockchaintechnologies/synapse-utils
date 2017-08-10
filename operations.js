//most relevantlibraries
-web3
-crypto
-ipfs

//relevant libs
"async": "^2.5.0",
"bignumber.js": "^4.0.2",
"datastore-fs": "^0.3.0",
"ethereumjs-wallet": "^0.6.0",
"ipfs": "^0.25.1",
"solc": "^0.4.15",
"web3": "^1.0.0-beta.15"

//---------------------------------------------------------------------------------
//dealing with Buffers a lot

//---------------------------------------------------------------------------------
//web3 contract instantiation
contract = web3.eth.contract(abi);
contractInstance = contract.at(contractAddress);

//---------------------------------------------------------------------------------
// web3 listening
// listen for target block
listenForBlocks() {
    const filter = web3.eth.filter('latest');

    filter.watch((err, result) => {
        const block = web3.eth.getBlock(result, true);
        if(block == target){
            return true;
        }
        return false;
    });
}

//---------------------------------------------------------------------------------
//ipfs subsub

// Establish an IPFS connection with pubsub enabled
const ipfs = new IPFS({
    repo: 'ipfs/tests/1',
    EXPERIMENTAL: {
        pubsub: true
    }
});

// Publish to IPFS channel of UUID
ipfs.pubsub.publish(uuid, pubdata, (err) => {
    if ( err ) {
        throw err;
    }
});

//subscribe
ipfs.pubsub.subscribe(uuid, (err, data) => {
    // Decrypt the data using crypto lib
    const decrypted = cipher.update(data)
     .final();

    callback(decrypted);
});

//---------------------------------------------------------------------------------
//secret handling

//creating keypair
keypair = crypto.createECDH('secp224k1');
public_key = "0x" + keypair.generateKeys('hex', 'compressed');


 * SUBSCRIBER SIDE
 */
// Do the key exchange
const secrethex = keypair.computeSecret(providers_public, 'hex');

// Generate a nonce
const nonce = crypto.randomBytes(32);
const noncehex = "0x" + nonce.toString('hex');

// Generate a UUID
const uuid = crypto.randomBytes(32);

// Encrypt it with the secret key
const cipher = crypto.createCipheriv('aes-256-ctr', new Buffer(secrethex, 16), nonce);
const euuid = "0x" + cipher.update(uuid)
.final('hex');

/*
 * PROVIDER SIDE
 */
// Get the subscriber's public key
const subscriber_public = data.public_key.substring(2); // bytes32 comes as 0x...

// Calculate the secret key
const secrethex = keypair.computeSecret(subscriber_public, 'hex');
const noncehex = data.nonce.substring(2);

// Get the relevant data as raw buffers
const secret = new Buffer(secrethex, 16);
const nonce = new Buffer(noncehex, 16);
const cipher_text = new Buffer(data.encrypted_uuid.substring(2), 16);

// Create the decipher object
const cipher = crypto.createDecipheriv('aes-256-ctr', secret, nonce);

// Add it to the decipher stream and decrypt to String
const uuid = cipher.update(cipher_text)
           + cipher.final('base64');

//---------------------------------------------------------------------------------

