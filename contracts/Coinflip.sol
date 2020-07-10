pragma solidity 0.5.12;

contract Coinflip{

  address owner;
  uint public contractBalance;
  uint private senderBetValue;


  constructor() public payable {
    owner = msg.sender;
    contractBalance = msg.value;
  }

  modifier costs(uint cost){
      require(msg.value >= cost);
      _;
  }

  struct Gambler {
    uint betValue;
    uint coinGuess;
    uint result;
  }

  mapping (address => Gambler) private bets;

  event Result (address player, bool betResult, uint valueBack);


    function random() public view returns (uint){
      //function to generate 1 or 0 to indicate win
        return now % 2;
    }



    function placeBet(uint coinSelection) public payable costs(1 wei) returns(bool betResult){
      //receive ETH into the contract as a bet and make a decision if someone won
      /*balance += msg.value;*/
      Gambler memory newGambler;
      uint toTransfer;
      address payable gambler = msg.sender;
      newGambler.betValue = msg.value;
      newGambler.coinGuess = coinSelection;
      newGambler.result = random();
      bets[gambler] = newGambler;

      if (bets[gambler].result == bets[gambler].coinGuess){
        toTransfer = bets[gambler].betValue * 2;
        gambler.transfer(toTransfer);
        emit Result(msg.sender, true, toTransfer);
        return true;
      }else{
        /*emit Result("You lost, try next time!", msg.sender);*/
        emit Result(msg.sender, false, 0);
        return false;
      }

    }


    /*function result() public returns (bool betResult){
      //function to generate 1 or 0 to indicate win
      address gambler = msg.sender;
      uint toTransfer = bets[gambler].betValue;
      if (bets[gambler].result == bets[gambler].coinGuess){
        msg.sender.transfer(toTransfer*2);
        emit Result(msg.sender, true);
        return true;
      }else{
        emit Result("You lost, try next time!", msg.sender);
        emit Result(msg.sender, false);
        return false;
      }
    }*/

    /*function insertGambler(Gambler memory newGambler, address ) private {
    address gambler = msg.sender;
    bets[gambler] = newGambler;
    }

    function sendWinnings(uint betValue) public returns (uint) {
      //send 2xETH back if user won
      address winner = msg.sender;
      uint toTransfer = bets[winner];
      balance = balance - toTransfer;
      msg.sender.transfer(toTransfer);
      deleteBet(sender);
      return toTransfer;
    }

    function deleteBet(address creator) private {
        delete bets[creator];
        assert(bets[creator] == 0);
    }*/
}
