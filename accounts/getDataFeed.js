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

//create a key pair &  generate exchange the keys
const pubRoomKey = crypto.create.ECDH('secp521r');
const pubRoom_Key = pubRoomKey.generateKeys('hex', 'compressed');

const pubRoomKeySecret = pubRoomKey.computeSecret.(pubRoom_Key);

//encrypt key pair -TODO

var cipher = crypto.createCipher();//kinda like this, will come back to in a bit


//get IPFS connection w. pubsub
node.on('ready', () => {
   EXPERIMENTAL:{
     pubsub: true;
   }
}
//subscribe to the pubsub channel & ipfs.pubsub.subscribe(topic, options, handler, callback)    
const topic = 'projected-message-data-feed'

const receiveMsg = (msg) => {
  console.log(msg.toString()
}
              
ipfs.pubsub.subscribe(topic, receiveMsg, uuid)
        

