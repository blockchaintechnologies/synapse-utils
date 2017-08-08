***DO NOT USE IN PRODUCTION***
to be run on airgapped machine. generates 
creds and tokens for list of int values ips
for use in simulation 

pip install -r requirements.txt

python gen_wallets.py members.txt

takes in a csv of value(integer) ip(string)
generates secret_records.json and server_records.json

each contains ip, intval, 2 uids, address  
secret_records.json also contains private keys
