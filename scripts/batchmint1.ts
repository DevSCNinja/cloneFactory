   
import { ethers } from "hardhat";

async function main() {
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // const NFTMinterFactory = await ethers.getContractFactory("NFTMinter");
    // const HappyHomies = await ethers.getContractFactory("happyHomies");
    // const MinterFactoryFactory = await ethers.getContractFactory(
    //   "MinterFactory"
    // );
    // console.log("deploying happyHomies ... ");
    // const happyHomies = await HappyHomies.deploy();
    // await happyHomies.deployed();
    // console.log("happyHomies address = ", happyHomies.address);

    // console.log("setting saleActive to true ... ");
    // let tx = await happyHomies.setSaleActive(true);
    // await tx.wait();
    // const saleActive = await happyHomies.saleActive();
    // console.log("saleActive = ", saleActive);
 
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

    const loveaddress = "0xA7a30fAEA743bF875dBa33D9F80F9c6B18273336";
    const NFTMiterAddress = "0x8e3861Fe2Ae1cd0728381211910C3B1935a11Dca";
    const MinterFactoryaddresss = "0x8acB7d89F31d0325F77a7B72e571427FA85581d1";

    const happyHomies = await ethers.getContractAt("LovelessCityMetropass", loveaddress);
    const NFTMinter = await ethers.getContractAt("NFTMinter", NFTMiterAddress);
    const MinterFactory = await ethers.getContractAt("MinterFactory", MinterFactoryaddresss);

    console.log("batchminting one ... ")
    let tx = await MinterFactory.batchCloneAndMint(1, {value: "1000000000000000"});
    await tx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });