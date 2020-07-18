pragma solidity 0.5.12;
import "./provableAPI.sol";
import "./Ownable.sol";

contract Coinflip is Ownable, usingProvable {

  address owner;
  uint private senderBetValue;
  uint256 public latestNumber;
  uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;


  modifier costs(uint cost){
      require(msg.value >= cost);
      _;
  }


  struct Player {
    address payable playerAddress;
    uint betValue;
    uint coinGuess;
    bool statusOfCallback;
    uint256 result;
  }


  mapping(bytes32=> Player) playerIds;

  event Result (address indexed player, bool betResult, uint valueBack);
  event Withdraw (address owner, uint valueWithdrawn);
  event LogNewProvableQuery(string description);
  event GeneratedRandomNumber(uint256 randomNumber);

  function getBalance() public view returns(uint){
    return address(this).balance;
  }

  function fundContract() public payable onlyOwner {
  }

  function withdrawAll() public onlyOwner  {
    uint toTransfer = address(this).balance;
    msg.sender.transfer(toTransfer);
    emit Withdraw(msg.sender, toTransfer);
   }

  function startGame(uint coinSelection) public payable costs(1 wei) {
    //receive ETH into the contract as a bet and make a call to usingProvable oracle for random number and store queryID into a mapping + all the valuesinto Player structure
    Player memory newPlayer;
    bytes32 playerQueryId;
    newPlayer.playerAddress = msg.sender;
    newPlayer.betValue = msg.value;
    newPlayer.coinGuess = coinSelection;

    playerQueryId = getRandomNumber();
    newPlayer.statusOfCallback = true;
    playerIds[playerQueryId] = newPlayer;
  }

  function getRandomNumber() public payable returns (bytes32) {
    uint256 QUERY_EXECUTION_DELAY = 0;
    uint256 GAS_FOR_CALLBACK = 200000;

    bytes32 realQueryId =  provable_newRandomDSQuery(QUERY_EXECUTION_DELAY, NUM_RANDOM_BYTES_REQUESTED, GAS_FOR_CALLBACK );

    emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");
    return realQueryId;
  }

  function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public {
      require(playerIds[_queryId].statusOfCallback == true,"Invalid callback status");
      require(msg.sender == provable_cbAddress(), "Invalid address for callback");
      uint toTransfer;

      uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) % 2;
      playerIds[_queryId].result = randomNumber;
      emit GeneratedRandomNumber(randomNumber);

      if (playerIds[_queryId].result == playerIds[_queryId].coinGuess){
        toTransfer = playerIds[_queryId].betValue * 2;
        playerIds[_queryId].playerAddress.transfer(toTransfer);
        emit Result(playerIds[_queryId].playerAddress, true, toTransfer);
      }else{
        emit Result(playerIds[_queryId].playerAddress, false, 0);
      }

  }
}
