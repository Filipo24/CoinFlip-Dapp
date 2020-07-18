const Coinflip = artifacts.require("Coinflip");

module.exports = function(deployer) {
  deployer.deploy(Coinflip, {value: web3.utils.toWei("0.5", "ether")});
};
