var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var selection;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance =  new web3.eth.Contract(abi, "0x4E730b2693E8f49514Ff8c08EedF8a66818B648A",{from: accounts[0]});
      console.log(contractInstance);
    });

    $("#heads").click(heads)
    $("#tails").click(tails)
    $("#bet_button").click(coinFlip)
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
    var betValue = parseFloat($("#bet_value").val());
    if (betValue > 10) {
      alert("Your bet is larger than maximum bet!");
    }else if (betValue > 0) {
        $("#bet_button").prop("disabled",true);
        var betValueString = $("#bet_value").val();
        var config = {
          value : web3.utils.toWei(betValueString,"ether"),
          gas : 2100000
        }
        contractInstance.methods.placeBet(selection).send(config)
        .on("transactionHash", function(hash){
          console.log(hash);
        })
        .on("confirmation", function(confirmationNr){
          console.log(confirmationNr);
        })
        .on("receipt", function(receipt){
          console.log(receipt);
          if (receipt.events.Result.returnValues.betResult == true) {
            console.log("Bet result is: "+receipt.events.Result.returnValues.betResult);
            $(".coin_picture").toggleClass("coin_animate_win");
            $(".coin_picture").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend animationend",
                        function(event) {
                  alert("You won!");
              $(".coin_picture").toggleClass("coin_animate_win");
              $("#bet_button").prop("disabled",false);
            });
          }else {
            console.log("Receipt here");
            console.log(receipt.events.Result.returnValues.betResult);
            $(".coin_picture").toggleClass("coin_animate_loss");
            $(".coin_picture").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend animationend",
                        function(event) {
                  alert("You lost try next time!");
              $(".coin_picture").toggleClass("coin_animate_loss");
              $("#bet_button").prop("disabled",false);
            });
          }
        })
    }else{
      alert("You need to select a value for your bet larger than 0!");
    }
  }
}
/*
function fetchAndDisplay(){
  contractInstance.methods.getPerson().call().then(function(result){
    $("#name_output").text(result.name);
    $("#age_output").text(result.age);
    $("#height_output").text(result.height);
  })
}
*/

/*function callRandom(){
  contractInstance.methods.random().call().then(function(result){
    console.log(result);
    randomValue = result;
  });
}*/
