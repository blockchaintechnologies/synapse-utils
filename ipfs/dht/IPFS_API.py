
# coding: utf-8

# In[ ]:





# In[ ]:





# In[ ]:





# In[94]:


import tweepy
#import sqlite3
import time
import ipfsapi

#your ApI info

consumer_key = "Pd2sItOG5feRHprMdzbnnFOgW"
consumer_secret = "kvxPFyGRdi6QF26B6gMkOGynSx5VukQeaIAYilMXQRi3bBoXUz"

key = "1357331449-wy278P13wF7CmHpxqdKOXm0tusIgKXdZPDknsN3"
secret = "tS9jhA0HLFOp4nYG0CBmcABhMMgE5wNEGLTgODbjBtfMa"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(key, secret)

api = tweepy.API(auth)

search="#donaldtrump"

c = tweepy.Cursor(api.search,
                       q=search,
                       include_entities=True).items(100)
tweets=[]

while True:
    try:
        tweet = c.next()
        tweets.append(tweet)
        print tweet
        # Insert into db
    except tweepy.TweepError:
        time.sleep(60 * 15)
        continue
    except StopIteration:
        break



# In[79]:


#write tweets to a file

thefile = open('test1.txt', 'w')
for item in tweets:
  thefile.write("%s\n" % item)


# In[92]:


#sending data to ipfs daemon

import ipfsapi
api = ipfsapi.connect('127.0.0.1', 5001)
res = api.add('test1.txt')
res


# In[ ]:





# In[ ]:




