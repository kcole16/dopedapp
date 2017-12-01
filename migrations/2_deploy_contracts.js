var Ownable = artifacts.require("./zeppelin/ownership/Ownable.sol");
var Killable = artifacts.require("./zeppelin/lifecycle/Killable.sol");
var Post = artifacts.require("./Post.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Killable);
  deployer.link(Ownable, Killable);
  deployer.deploy(Post);
};
