/*TODO 
   - generate the nonce, UUID, and encrypt with secret key for the subscriber
   - create a channel to pubsub room, verfiy the UUID, nonce and secret key as someone who has purchased the datafeed
   - display all the infromation for the subscriber once the data has been  decrypted ( The data will not be shown as decrypted if its not 
     decrypted in the previous step. It will shows up as encrypted or not even show up at all). 
*/
const crypto = require('crypto');
const IPFS = require('ipfs')
const node = new IPFS()

//generate the Nonce you need to do npm install -a-nonce-generator
const {generateNonce} = require('a-nonce-generator');
const nonce = generateNonce();

//creates the pubsub room
const uuid = require('uuid-random');
uuid();

//create a key pair & cipher

var cipher = crypto.createCipher();

crypto.ecdh.generateKeys(['hex', 'compressed']); 

node.on('ready', () => {
   EXPERIMENTAL:{
     pubsub: true;
   }
}
 
//verify the publisher's key as someone who is selling the feed
  var decipher = crypto.createDecipher();
//decrypt the information with the cipher if its the valid/verified person
   
        if(the nonce is the same as nonce up top){        
}
        else {
           throw;
        }
//show the decrypted code and if not decrypted you can show the encrypted code with an error or nothing at all except error
        
  
