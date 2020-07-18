var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var selection;
var playerAddress;
var contractBalance;
var maxBet;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance =  new web3.eth.Contract(abi, "0x497ee57D40459D0AFb0E4F9854e1783b7fC03E82",{from: accounts[0]});
      console.log(contractInstance);
      getContractBalance();
    });


    $("#heads").click(heads);
    $("#tails").click(tails);
    $("#bet_button").click(coinFlip);
    $("#contract_balance_button").click(getContractBalance);
    $("#contract_fund_button").click(increaseContractBalance);
    $("#withdraw_all_button").click(withdrawFromContract);
});

function heads(){
  selection = 1;
  $("#selection").text("You have selected Heads");
}

function tails(){
  selection = 0;
  $("#selection").text("You have selected Tails");
}


function coinFlip(){
  if (selection == null) {
    alert("Make your selection first!");
  }else {
    contractInstance.methods.getBalance().call().then(function(result){
      maxBet = web3.utils.fromWei(result,"ether") / 2;
      var betValue = $("#bet_value").val();

      if (parseFloat(maxBet) < parseFloat(betValue)) {
        alert("Your bet is larger than maximum bet!");
      }
      else if (betValue > 0) {

          $("#bet_button").prop("disabled",true);
          var config = {
            value : web3.utils.toWei(betValue,"ether"),
            gas : 2100000
          }
          contractInstance.methods.startGame(selection).send(config)
          .on("transactionHash", function(hash){
            console.log(hash);

          })
          .on("confirmation", function(confirmationNr){
            if (confirmationNr < 4) {
              console.log(confirmationNr);
            }
          })
          .on("receipt", function(receipt){
            console.log(receipt);
            playerAddress = receipt.from;
            console.log("Player address is: "+receipt.from);
          })


          contractInstance.once('GeneratedRandomNumber', {
            filter: {address: playerAddress}
          }, function(error, event){
            console.log(event);
            console.log("Generated random number for player "+playerAddress+" is : "+event.returnValues.randomNumber);
          });


          contractInstance.once('Result', {
            filter: {address: playerAddress}
          }, function(error, event){
            console.log(event);

            if (event.returnValues.betResult == true) {
              console.log("Bet result is: "+event.returnValues.betResult);
              $(".coin_picture").toggleClass("coin_animate_win");
              $(".coin_picture").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend animationend",
                          function(event) {
                    alert("You won!");
                $(".coin_picture").toggleClass("coin_animate_win");
                $("#bet_button").prop("disabled",false);
              });
            }else {
              console.log("Bet result is: "+event.returnValues.betResult);
              $(".coin_picture").toggleClass("coin_animate_loss");
              $(".coin_picture").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend animationend",
                          function(event) {
                    alert("You lost try next time!");
                $(".coin_picture").toggleClass("coin_animate_loss");
                $("#bet_button").prop("disabled",false);
              });
            }
            getContractBalance();
          });
      }
      else{
        alert("You need to select a value for your bet larger than 0!");
      }
    });
  }
}

function getContractBalance(){
  contractInstance.methods.getBalance().call().then(function(result){
    contractBalance = web3.utils.fromWei(result,"ether")
    console.log("Contract balance: "+contractBalance);
    $("#contract_balance_text").text(contractBalance+" ETH");
  })
}

function withdrawFromContract(){
  contractInstance.methods.withdrawAll().send()
  .on("transactionHash", function(hash){
    console.log(hash);
  })
  .on("confirmation", function(confirmationNr){
    if (confirmationNr < 4) {
      console.log(confirmationNr);
    }
  })
  .on("receipt", function(receipt){
    console.log(receipt);
    var totalWithdrawn = web3.utils.fromWei(receipt.events.Withdraw.returnValues.valueWithdrawn,"ether")
    console.log("Total ETH withdrawn from contract: "+totalWithdrawn);
    getContractBalance();
  })
}

function increaseContractBalance(){
  var fundValue = $("#contract_fund_value").val();
  console.log(fundValue);
  if (fundValue == "" ) {
    alert("Select the amount of ETH before funding contract");
  }else {

    var config = {
      value : web3.utils.toWei(fundValue,"ether"),
      gas : 2100000
    }
    contractInstance.methods.fundContract().send(config)
    .on("transactionHash", function(hash){
      console.log(hash);
    })
    .on("confirmation", function(confirmationNr){
      if (confirmationNr < 4) {
        console.log(confirmationNr);
      }
    })
    .on("receipt", function(receipt){
      console.log(receipt);
      getContractBalance();
    })
  }
}
