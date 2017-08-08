#!/usr/bin/python

# pip install ecdsa
# pip install pysha3

from ecdsa import SigningKey, SECP256k1
import sha3
import sys
from pprint import pprint

class Ethereum():
		def genAccounts(self, num):
			accs = []
			for i in range(0, num):
				keccak = sha3.keccak_256()

				priv = SigningKey.generate(curve=SECP256k1)
				pub = priv.get_verifying_key().to_string()

				keccak.update(pub)

				acc={}
				acc['address'] = keccak.hexdigest()[24:]
				acc['priv'] = (priv.to_string()).encode("hex")
				acc['pub'] = pub.encode("hex")
				accs.append(acc)
			return accs


def main():
	eth = Ethereum()
	accs = eth.genAccounts(10)
	pprint(accs)

if __name__ == "__main__": main()
