from gen_bitcoin import Bitcoin
from gen_ethereum import Ethereum
import sys
from random import randint
import json
import base64
import os 

fname = sys.argv[1]
with open(fname) as f:
	lines = f.readlines()

num = len(lines)

server_file = 'server_records.json'
secret_file = 'secret_records.json'

ethereum = Ethereum()
bitcoin = Bitcoin()

eaccs = ethereum.genAccounts(num)
baccs = bitcoin.AddressGenerator(num)

server_recs = []
secret_recs = []

with open(secret_file, 'w') as secf:
	with open(server_file, 'w') as servf:

		for i in range(0,num):

			uid1 = base64.urlsafe_b64encode(os.urandom(16)) 
			uid2 = base64.urlsafe_b64encode(os.urandom(16)) 

			server_rec = {}
			secret_rec = {}

			server_rec['eaddr'] = eaccs[i]['address']
			server_rec['baddr'] = baccs[i]['address']
			server_rec['ip'] = (lines[i].split(' ')[1]).replace("\n",'')
			server_rec['value'] = lines[i].split(' ')[0].replace("\n",'')
			server_rec['uid1'] = uid1 
			server_rec['uid2'] = uid2 
			#serv_line = ','.join(server_rec)
			#servf.write("%s\n" % server_rec)
			server_recs.append(server_rec)

			secret_rec['eaddr'] = eaccs[i]['address']
			secret_rec['baddr'] = baccs[i]['address']
			secret_rec['ip'] = (lines[i].split(' ')[1]).replace("\n",'')
			secret_rec['value'] = lines[i].split(' ')[0]
			secret_rec['epriv'] = eaccs[i]['priv']
			secret_rec['bpriv'] = baccs[i]['priv']

			secret_rec['uid1'] = uid1 
			secret_rec['uid2'] = uid2 

			#sec_line = ','.join(secret_rec)
			#secf.write("%s\n" % secret_rec)
			secret_recs.append(secret_rec)

	
		secf.write(json.dumps(secret_recs))
		servf.write(json.dumps(server_recs))
