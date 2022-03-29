// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ITarget {
  // function purchase(uint256 quantity, bytes calldata signature) external payable;
  function mintToken(uint256 quantity) external payable;
  function ownerOf(uint256 tokenID) external view returns(address);
  function totalSupply() external view returns(uint256);
}
interface IERC721{
  function transferFrom(address from, address to, uint256 id) external;
}

contract NFTMinter {

  constructor() {
  }

  function initialize(address _owner, address _NFT) external payable {
    ITarget(_NFT).mintToken{value: msg.value}(1);
  }

  function mint(address _NFT) external payable {
    ITarget(_NFT).mintToken{value: msg.value}(1);
  }

  function withdraw(uint256 tokenID, address to, address NFT) external{
    IERC721(NFT).transferFrom(address(this), to, tokenID);
  }

  function getTokenID(address _NFT) external view returns(uint256 id) {
    for (uint256 i = 1; i < ITarget(_NFT).totalSupply(); i++) {
      if(ITarget(_NFT).ownerOf(i) == address(this)){
        id = i;
        break;
      }
    }
  }

  event Received();

  function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes calldata _data
  )
    external
    returns(bytes4)
  {
    _operator;
    _from;
    _tokenId;
    _data;
    emit Received();
    return 0x150b7a02;
  }
}