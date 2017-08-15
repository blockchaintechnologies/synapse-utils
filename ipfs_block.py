import ipfsapi
api = ipfsapi.connect('127.0.0.1', 5001)
res = api.add('/home/aasim/ipfs/toast.txt')

ids=api.id()

"""using ipfs block it will break the file into small size and 
safe it in merkle tree and return root 
ipfs block is diffrent from normal ipfs 
ensure this file is larger than 256k
"""

#block1=api.block_put('/home/aasim/ipfs/Python4DataAnalysis.pdf')
#value=block1['Key']
#print value
#txt=api.block_get(value)
f=api.add('/home/aasim/ipfs/Python4DataAnalysis.pdf')
print f
h=f['Hash']
print h
block1=api.block_put('QmdMhrrrSA1vLhbXSGhJ45opg7UwpG9Pd94LabFaom16PV')
#print api.ls(str(h))

