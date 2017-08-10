/*TODO 
   - generate the nonce, UUID, and encrypt with secret key for the subscriber
   - create a channel to pubsub room, verfiy the UUID, nonce and secret key as someone who has purchased the datafeed
   - decrypt the information with the cipher if its the valid/verified person
   - display all the infromation for the subscriber once the data has been  decrypted ( The data will not be shown as decrypted if its not 
     decrypted in the previous step. It will shows up as encrypted or not even show up at all). 
*/
const crypto = require('crypto');


const { generateNonce} = require('a-nonce-generator');
const nonce = generateNonce();

const uuid = require('uuid-random');
uuid();

//ecdh.generateKeys([encoding[,format]]); TODO








