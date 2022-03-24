// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ITarget {
  function purchase(uint256 quantity, bytes calldata signature) external payable;
}
interface IERC721{
  function transferFrom(address from, address to, uint256 id) external;
}

contract NFTMinter {

  constructor() {
  }

  function initialize(address _owner, address _NFT) external payable {
    ITarget(_NFT).purchase{value: msg.value}(1, "");
  }

  function withdraw(uint256 tokenID, address to, address NFT) external{
    IERC721(NFT).transferFrom(address(this), to, tokenID);
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