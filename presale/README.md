recommended way to test
paste code into remix editor ( https://remix.ethereum.org )
set account/network provider
'Create' contract


check owner of contract matches deployer address -> getOwner()

check that presale is inactive-> getPresale()

with owner address and non owner address attempt to toggle contract as active or inactive
->togglePresale() -> getPresale()

send ether to contract payable function. currently named invest() 
[note, in remix, must input value of eth to send as well as account imn top right rail before testing invest(). in production this function will be fallback and have no name. here it is included to ease testing in remix]

check balance of tokens -> balanceOf(address) [note balance is expressed in smallest unit. compare to wei]
as owner, withdraw amount of ether -> ownerWithdraw()
as nonowner, attempt to withdraw

check contract ether balance -> getPresaleValue() in wei 

 
