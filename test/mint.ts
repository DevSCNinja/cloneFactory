import { expect } from "chai";
import { exec } from "child_process";
import { ethers } from "hardhat";

describe("MinterFactory", function () {
  it("Should clone and mint", async function () {
    const NFTMinterFactory = await ethers.getContractFactory("NFTMinter");
    const HappyFactory = await ethers.getContractFactory("happyHomies");
    const MinterFactoryFactory = await ethers.getContractFactory(
      "MinterFactory"
    );
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    console.log("deploying happyHomies ... ");
    const happyHomies = await HappyFactory.deploy();
    await happyHomies.deployed();
    console.log("happyHomies address = ", happyHomies.address);

    console.log("setting saleActive to true ... ");
    let tx = await happyHomies.setSaleActive(true);
    await tx.wait();

    console.log("owner is minting 1 ntf ...");
    tx = await happyHomies.mintToken(1, { value: "1000000000000000" });
    await tx.wait();
    const bal = await happyHomies.balanceOf(owner.address);
    expect(bal).to.be.equal(1);
    console.log("bal = ", bal);

    // console.log("deploying NFTMinter ... ");
    // const NFTMinter = await NFTMinterFactory.deploy();
    // await NFTMinter.deployed();
    // console.log("NFTMinter address = ", NFTMinter.address);

    // console.log("deploying MinterFactory ...");
    // const MinterFactory = await MinterFactoryFactory.deploy(
    //   NFTMinter.address,
    //   happyHomies.address
    // );
    // await MinterFactory.deployed();
    // console.log("MinterFactory address = ", MinterFactory.address);

    // expect(await MinterFactory.minter()).to.be.equal(NFTMinter.address);
    // expect(await MinterFactory.NFT()).to.be.equal(happyHomies.address);

    // console.log("cloning one ...");
    // tx = await MinterFactory._clone({value: "1000000000000000"});
    // await tx.wait();

    // const cloned = await MinterFactory.returnClones(owner.address);
    // console.log("cloned Minter address = ", cloned);

    // const minter = await MinterFactory.minter();
    // console.log("minter = ", minter);

    // const Nft = await MinterFactory.NFT();
    // console.log("Nft = ", Nft);

    // // console.log("minting 1 nft by cloned minter ... ");
    // // tx = await MinterFactory.mint(1, 0, { value: "1000000000000000" });
    // // await tx.wait();

    // const bal0 = await happyHomies.balanceOf(owner.address);
    // expect(bal0).to.be.equal(1);
    // console.log("cloned minter now has %d nfts", bal0);

    // console.log("withdrawing cloned minter's nft ...");
    // tx = await MinterFactory.withdraw(0, 1, owner.address);
    // await tx.wait();
    // const balowner = await happyHomies.balanceOf(owner.address);
    // console.log("balance of owner is now %d", balowner);
    // expect(balowner).to.be.equal(2);
  });
  it("Should clone and mint", async function () {
    const NFTMinterFactory = await ethers.getContractFactory("NFTMinter");
    const HappyFactory = await ethers.getContractFactory("happyHomies");
    const MinterFactoryFactory = await ethers.getContractFactory(
      "MinterFactory"
    );

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

    expect(await MinterFactory.minter()).to.be.equal(NFTMinter.address);
    expect(await MinterFactory.NFT()).to.be.equal(happyHomies.address);

    console.log("preCloning 50 ...");
    tx = await MinterFactory.preClone(50);
    let reciept = await tx.wait();
    let sumEvent = reciept.events?.pop();

    console.log("gas", reciept.cumulativeGasUsed.toString());

    const clones = await MinterFactory.returnPreClones();
    // console.log("cloned addresses = ", clones);

    expect(clones.length).to.be.equal(50);

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
    expect(balace).to.be.equal(10);
  });
});
