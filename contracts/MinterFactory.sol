// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import 'hardhat/console.sol';

interface INFTMinter {
    function initialize(address _owner, address _NFT) external payable;
    function mint(uint amount) external payable;
    function withdraw(uint256 tokenID, address to, address NFT) external;
}

interface INFT {
    function totalSupply() external view returns(uint256);
    function tokenPrice() external view returns(uint256);
    function balanceOf(address owner) external view returns(uint256);
    function MAX_SUPPLY() external view returns(uint256);
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns(uint256);
}

contract MinterFactory is Ownable{
    address public minter;
    address public NFT;
    mapping(address=>address[]) public allClones;
    
    event NewClone(address _newClone, address _owner);

    using Clones for address;

    constructor(address _minter, address _NFT) {
        console.log("MinterFactory: NFT = ", _NFT);
        console.log("MinterFactory: minter = ", _minter);
        minter = _minter;
        NFT = _NFT;
    }

    function batchCloneAndMint(uint256 amount) external payable{
        require(INFT(NFT).totalSupply() + amount <= INFT(NFT).MAX_SUPPLY(), "MinterFactory: amount exceeds");
        require(INFT(NFT).tokenPrice() * amount <= msg.value);
        for (uint256 i = 0; i < amount; i++){
            address indenticalChild = minter.clone();
            INFTMinter(indenticalChild).initialize{value: INFT(NFT).tokenPrice()}(address(this), NFT);
            emit NewClone(indenticalChild, msg.sender);
            allClones[msg.sender].push(indenticalChild);
        }
    }

    function batchWithdraw(uint256 amount, address to) external{
        uint256 balance = 0;
        for (uint256 i = 0; i < allClones[msg.sender].length; i++){
            balance += INFT(NFT).balanceOf(allClones[msg.sender][i]);
        }
        require(balance >= amount, "MinterFactory: balance lack");
        uint256 withdrawed = 0;
        for (uint256 i = 0; i < allClones[msg.sender].length; i++){
            if (withdrawed == amount) break;
            if(INFT(NFT).balanceOf(allClones[msg.sender][i]) > 0){
                INFTMinter(allClones[msg.sender][i]).withdraw(INFT(NFT).tokenOfOwnerByIndex(allClones[msg.sender][i], 0), to, NFT);
                withdrawed++;
            }
        }
    }

    function _clone() external payable{
        address indenticalChild = minter.clone();
        INFTMinter(indenticalChild).initialize{value: INFT(NFT).tokenPrice()}(address(this), NFT);
        emit NewClone(indenticalChild, msg.sender);
        allClones[msg.sender].push(indenticalChild);
    }

    function returnClones(address owner) external view returns(address[] memory) {
        return allClones[owner];
    }

    function withdraw(uint256 minterIndex, uint256 tokenID, address to) public {
        INFTMinter(allClones[msg.sender][minterIndex]).withdraw(tokenID, to, NFT);
    }
}
