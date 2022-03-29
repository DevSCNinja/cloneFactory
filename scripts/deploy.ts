import { ethers } from "hardhat";

async function main() {
  const NFTMinterFactory = await ethers.getContractFactory("NFTMinter");
  const HappyFactory = await ethers.getContractFactory("happyHomies");
  const MinterFactoryFactory = await ethers.getContractFactory("MinterFactory");

  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  console.log("deploying happyHomies ... ");
  const happyHomies = await HappyFactory.deploy();
  await happyHomies.deployed();
  console.log("happyHomies address = ", happyHomies.address);

  console.log("setting saleActive to true ... ");
  let tx = await happyHomies.setSaleActive(true);
  await tx.wait();

  // console.log("owner is minting 1 ntfs ...");
  // tx = await happyHomies.mint(1, "0x00", { value: "1000000000000000" });
  // await tx.wait();
  // const bal = await happyHomies.balanceOf(owner.address);
  // expect(bal).to.be.equal(1);
  // console.log("bal = ", bal);

  console.log("deploying NFTMinter ... ");
  const NFTMinter = await NFTMinterFactory.deploy();
  await NFTMinter.deployed();
  console.log("NFTMinter address = ", NFTMinter.address);

  console.log("deploying MinterFactory ...");
  const MinterFactory = await MinterFactoryFactory.deploy(
    NFTMinter.address,
    happyHomies.address
  );
  await MinterFactory.deployed();
  console.log("MinterFactory address = ", MinterFactory.address);

  console.log("preCloning 50 ...");
  tx = await MinterFactory.preClone(50);
  let reciept = await tx.wait();
  let sumEvent = reciept.events?.pop();

  console.log("gas", reciept.cumulativeGasUsed.toString());

  const clones = await MinterFactory.returnPreClones();
  console.log("cloned addresses = ", clones);

  console.log("batch minting 50 ...");
  tx = await MinterFactory.batchMint(50, { value: "50000000000000000" });
  reciept = await tx.wait();
  sumEvent = reciept.events?.pop();

  console.log("gas", reciept.cumulativeGasUsed.toString());

  console.log("batchWithdrawing 10 to owner ... ");
  tx = await MinterFactory._batchWithdraw(10, owner.address);
  reciept = await tx.wait();
  sumEvent = reciept.events?.pop();

  console.log("gas", reciept.cumulativeGasUsed.toString());

  const balace = await happyHomies.balanceOf(owner.address);
  console.log("balance of owner is now ", balace.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
