// Abstract contract for the full ERC 20 Token standard
// https://github.com/ethereum/EIPs/issues/20
pragma solidity ^0.4.8;


// @title Math operations with safety checks
contract SafeMath {
  function safeMul(uint a, uint b) internal returns (uint) {
    uint c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function safeDiv(uint a, uint b) internal returns (uint) {
    assert(b > 0);
    uint c = a / b;
    assert(a == b * c + a % b);
    return c;
  }

  function safeSub(uint a, uint b) internal returns (uint) {
    assert(b <= a);
    return a - b;
  }

  function safeAdd(uint a, uint b) internal returns (uint) {
    uint c = a + b;
    assert(c>=a && c>=b);
    return c;
  }

  function max64(uint64 a, uint64 b) internal constant returns (uint64) {
    return a >= b ? a : b;
  }

  function min64(uint64 a, uint64 b) internal constant returns (uint64) {
    return a < b ? a : b;
  }

  function max256(uint256 a, uint256 b) internal constant returns (uint256) {
    return a >= b ? a : b;
  }

  function min256(uint256 a, uint256 b) internal constant returns (uint256) {
    return a < b ? a : b;
  }

  function assert(bool assertion) internal {
    if (!assertion) {
      throw;
    }
  }
}

contract Token {
    /* This is a slight change to the ERC20 base standard.
    function totalSupply() constant returns (uint256 supply);
    is replaced with:
    uint256 public totalSupply;
    This automatically creates a getter function for the totalSupply.
    This is moved to the base contract since public getter functions are not
    currently recognised as an implementation of the matching abstract
    function by the compiler.
    */
    /// total amount of tokens
    uint256 public totalSupply;

    /// @param _owner The address from which the balance will be retrieved
    /// @return The balance
    function balanceOf(address _owner) constant returns (uint256 balance);

    /// @notice send `_value` token to `_to` from `msg.sender`
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return Whether the transfer was successful or not
    function transfer(address _to, uint256 _value) returns (bool success);

    /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return Whether the transfer was successful or not
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);

    /// @notice `msg.sender` approves `_spender` to spend `_value` tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @param _value The amount of tokens to be approved for transfer
    /// @return Whether the approval was successful or not
    function approve(address _spender, uint256 _value) returns (bool success);

    /// @param _owner The address of the account owning tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @return Amount of remaining tokens allowed to spent
    function allowance(address _owner, address _spender) constant returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}


/*
You should inherit from StandardToken or, for a token like you would want to
deploy in something like Mist, see PresaleToken.sol.
(This implements ONLY the standard functions and NOTHING else.
If you deploy this, you won't have anything useful.)

Implements ERC 20 Token standard: https://github.com/ethereum/EIPs/issues/20
.*/

contract StandardToken is Token {

    function transfer(address _to, uint256 _value) returns (bool success) {
        throw;
        //Default assumes totalSupply can't be over max (2^256 - 1).
        //If your token leaves out totalSupply and can issue more tokens as time goes on, you need to check if it doesn't wrap.
        //Replace the if with this one instead.
        //require(balances[msg.sender] >= _value && balances[_to] + _value > balances[_to]);
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        throw;
        //same as above. Replace this line with the following if you want to protect against wrapping uints.
        //require(balances[_from] >= _value && allowed[_from][msg.sender] >= _value && balances[_to] + _value > balances[_to]);
        require(balances[_from] >= _value && allowed[_from][msg.sender] >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        allowed[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        return true;
    }

    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
      return allowed[_owner][_spender];
    }

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;
}


contract PresaleToken is StandardToken, SafeMath{

    string public name="Presale";                   
    uint8 public decimals=18; 
    string public symbol="PRE";                 
    string public version = '0.1';       
    

    
    // $0.12/1 token if $300/1 ether
    uint256 public constant presale_price = 40**14;
    address public owner;
    bool public presale = false;

    event PresalInactive(bytes32 message);
    event PresaleActive(bytes32 message);
    event WithdrawSuccess(address withdrawTo, uint256 amount);
    event WithdrawFail(address withdrawTo, uint256 amount);
    event InitPurchase(address sender, uint256 quantity, uint256 initial);
    event PostPurchase(address presale, address sender, uint256 quantity);
    event PresaleState(bool presale);
    event Owner(address _address);
    event OwnerSet(address sender, address owner);
    event PresaleValue(uint256 _value);
    event PayableHit(address _address, uint256 _value);

    
    // if person is not owner of the contract throw
    modifier isOwner() {
            if (msg.sender != owner) throw;
            _;
    }
    
    /// @notice `msg.sender` invest `msg.value`
    function invest() payable {
        
        PayableHit(msg.sender, msg.value);
        
        //check value sent
        require(msg.value > 0);
        
        // check active
        require(presale);

        // calculate quantity
        uint256 quantity = safeDiv(msg.value, presale_price);
        InitPurchase(msg.sender, quantity, balances[msg.sender]);
        
        // update balance of sender
        balances[msg.sender] = safeAdd(balances[msg.sender], quantity);
        PostPurchase(this, msg.sender, quantity);
    }

    //set owner of presale token to deployer address
    function PresaleToken() {
        owner = msg.sender;
        OwnerSet(msg.sender, owner);
    }

    //toggle presale on/off
    function togglePresale() external isOwner {
        presale=!presale;
    }

    //withdraw to owner address
    function ownerWithdraw(uint256 value) external isOwner {

        if (!owner.send(value)){
          WithdrawFail(owner, value);
          throw;  
        } 
        else{
            WithdrawSuccess(owner,value);
        }
    }
    
    function getPresaleValue() external returns (uint256 _value){
        PresaleValue(this.balance);
        return this.balance;
    }
    
    //get presale status
    function getPresale() external returns (bool _presale){
        PresaleState(presale);
        return presale;
    }
    
    //get owner address
    function getOwner() external returns (address _owner) {
        Owner(owner);
        return owner;
    }

}
