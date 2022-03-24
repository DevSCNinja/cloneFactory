   
import { ethers } from "hardhat";

async function main() {
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const NFTMinterFactory = await ethers.getContractFactory("NFTMinter");
    const LOVEFActory = await ethers.getContractFactory("LovelessCityMetropass");
    const MinterFactoryFactory = await ethers.getContractFactory(
      "MinterFactory"
    );
    console.log("deploying LovelessCityMetropass ... ");
    const Love = await LOVEFActory.deploy(owner.address, owner.address, "https://baseURI/");
    await Love.deployed();
    console.log("Love address = ", Love.address);

    console.log("setting onlyWhitelist to false ... ");
    let tx = await Love.triggerWhitelist(false);
    await tx.wait();
    const whitelistOnly = await Love.whitelistOnly();
    console.log("whitelistOnly = ", whitelistOnly);

    console.log("setting saleIsActive to true");
    tx = await Love.updateSaleStatus(true);
    await tx.wait();
    const saleIsActive = await Love.saleIsActive();
    console.log("saleIsActive = ", saleIsActive);
 
    console.log("deploying NFTMinter ... ");
    const NFTMinter = await NFTMinterFactory.deploy();
    await NFTMinter.deployed();
    console.log("NFTMinter address = ", NFTMinter.address);

    console.log("deploying MinterFactory ...");
    const MinterFactory = await MinterFactoryFactory.deploy(
      NFTMinter.address,
      Love.address
    );
    await MinterFactory.deployed();
    console.log("MinterFactory address = ", MinterFactory.address);

    console.log("batch cloning and minting 50 ...")
    tx = await MinterFactory.batchCloneAndMint(50, {value: "50000000000000000"});
    let reciept = await tx.wait();
    let sumEvent = reciept.events?.pop();
    console.log("return", sumEvent?.args?.[0]);

    console.log("gas", reciept.cumulativeGasUsed.toString())

    // const clones = await MinterFactory.returnClones(owner.address);
    // console.log("cloned addresses = ", clones);

    // console.log("batchWithdrawing 10 to owner ... ");
    // tx = await MinterFactory.batchWithdraw(10, owner.address);
    // await tx.wait();

    // const bal = await Love.balanceOf(owner.address);
    // console.log("bal = ", bal.toString());

    // console.log("clonsing1...");
    // tx = await MinterFactory.spawnit();
    // let reciept = await tx.wait();
    // let sumEvent = reciept.events?.pop();
    // console.log("spawned = ", sumEvent?.args?.[0]);
    // console.log("gas", reciept.cumulativeGasUsed.toString())

    // console.log("clonsing1...");
    // tx = await MinterFactory._clone();
    // reciept = await tx.wait();
    // sumEvent = reciept.events?.pop();
    // console.log("spawned = ", sumEvent?.args?.[0]);
    // console.log("gas", reciept.cumulativeGasUsed.toString())

    // console.log("mintingone ... ");
    // tx =await MinterFactory.mint(1, 0, {value: "1000000000000000"});
    // await tx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });