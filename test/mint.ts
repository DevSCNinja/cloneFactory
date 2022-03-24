import { expect } from "chai";
import { exec } from "child_process";
import { ethers } from "hardhat";
import { MinterFactory } from "../typechain";

describe("MinterFactory", function () {
  it("Should clone and mint", async function () {
    const NFTMinterFactory = await ethers.getContractFactory("NFTMinter");
    const LOVEFActory = await ethers.getContractFactory("LovelessCityMetropass");
    const MinterFactoryFactory = await ethers.getContractFactory(
      "MinterFactory"
    );
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    console.log("deploying happyHomies ... ");
    const Love = await LOVEFActory.deploy(owner.address, owner.address, "https://baseURI/");
    await Love.deployed();
    console.log("Love address = ", Love.address);

    console.log("setting onlyWhitelist to false ... ");
    let tx = await Love.triggerWhitelist(false);
    await tx.wait();
    const whitelistOnly = await Love.whitelistOnly();
    expect(whitelistOnly).to.be.equal(false);
    console.log("whitelistOnly = ", whitelistOnly);

    console.log("setting saleIsActive to true");
    tx = await Love.updateSaleStatus(true);
    await tx.wait();
    const saleIsActive = await Love.saleIsActive();
    expect(saleIsActive).to.be.equal(true);
    console.log("saleIsActive = ", saleIsActive);

    console.log("owner is minting 1 ntf ...");
    tx = await Love.purchase(1, "0x00", { value: "1000000000000000" });
    await tx.wait();
    const bal = await Love.balanceOf(owner.address);
    expect(bal).to.be.equal(1);
    console.log("bal = ", bal);

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

    expect(await MinterFactory.minter()).to.be.equal(NFTMinter.address);
    expect(await MinterFactory.NFT()).to.be.equal(Love.address);

    console.log("cloning one ...");
    tx = await MinterFactory._clone({value: "1000000000000000"});
    await tx.wait();

    const cloned = await MinterFactory.returnClones(owner.address);
    console.log("cloned Minter address = ", cloned);

    const minter = await MinterFactory.minter();
    console.log("minter = ", minter);

    const Nft = await MinterFactory.NFT();
    console.log("Nft = ", Nft);

    // console.log("minting 1 nft by cloned minter ... ");
    // tx = await MinterFactory.mint(1, 0, { value: "1000000000000000" });
    // await tx.wait();

    const bal0 = await Love.balanceOf(owner.address);
    expect(bal0).to.be.equal(1);
    console.log("cloned minter now has %d nfts", bal0);

    console.log("withdrawing cloned minter's nft ...");
    tx = await MinterFactory.withdraw(0, 1, owner.address);
    await tx.wait();
    const balowner = await Love.balanceOf(owner.address);
    console.log("balance of owner is now %d", balowner);
    expect(balowner).to.be.equal(2);
  });
  it("Should clone and mint", async function () {
    const NFTMinterFactory = await ethers.getContractFactory("NFTMinter");
    const LOVEFActory = await ethers.getContractFactory("LovelessCityMetropass");
    const MinterFactoryFactory = await ethers.getContractFactory(
      "MinterFactory"
    );

    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    console.log("deploying happyHomies ... ");
    const Love = await LOVEFActory.deploy(owner.address, owner.address, "https://baseURI/");
    await Love.deployed();
    console.log("Love address = ", Love.address);

    console.log("setting onlyWhitelist to false ... ");
    let tx = await Love.triggerWhitelist(false);
    await tx.wait();
    const whitelistOnly = await Love.whitelistOnly();
    expect(whitelistOnly).to.be.equal(false);
    console.log("whitelistOnly = ", whitelistOnly);

    console.log("setting saleIsActive to true");
    tx = await Love.updateSaleStatus(true);
    await tx.wait();
    const saleIsActive = await Love.saleIsActive();
    expect(saleIsActive).to.be.equal(true);
    console.log("saleIsActive = ", saleIsActive);

    console.log("owner is minting 1 ntfs ...");
    tx = await Love.purchase(1, "0x00", { value: "1000000000000000" });
    await tx.wait();
    const bal = await Love.balanceOf(owner.address);
    expect(bal).to.be.equal(1);
    console.log("bal = ", bal);

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

    expect(await MinterFactory.minter()).to.be.equal(NFTMinter.address);
    expect(await MinterFactory.NFT()).to.be.equal(Love.address);

    console.log("batch cloning and minting 50 ...")
    tx = await MinterFactory.connect(addr1).batchCloneAndMint(50, {value: "50000000000000000"});
    await tx.wait();

    const clones = await MinterFactory.returnClones(addr1.address);
    console.log("cloned addresses = ", clones);

    expect(clones.length).to.be.equal(50);

    console.log("batchWithdrawing 10 to owner ... ");
    tx = await MinterFactory.connect(addr1).batchWithdraw(10, owner.address);
    await tx.wait();

    const balace = await Love.balanceOf(owner.address);
    expect(balace).to.be.equal(11);

  });
});
