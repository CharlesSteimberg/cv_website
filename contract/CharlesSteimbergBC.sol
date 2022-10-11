// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
import "./libraries/Base64.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract CharlesSteimbergBC is ERC2771Context, ERC1155, Ownable {

  string public contractURI;
  address private trustedForwarder; 

  struct BusinessCardAttributes {
    string name;
    string imageURI;
    string[] masters;
    string[] skills;
  }

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping(uint256 => BusinessCardAttributes) public nftCardHolderAttributes;
  
  event CardMinted(address sender, uint256 tokenId, uint quantity);

  event CardGiven(address sender, uint256 tokenId, uint quantity);

  constructor (string memory _contractURI, address _trustedForwarder) ERC2771Context(_trustedForwarder) ERC1155("0x00"){
    contractURI = _contractURI;
    trustedForwarder = _trustedForwarder;
    _tokenIds.increment();
  }

  function mintCardNFT(uint _quantity, BusinessCardAttributes calldata _attributes) external onlyOwner{

    uint256 newItemId = _tokenIds.current();
   
    _mint(_msgSender(), newItemId, _quantity, "");

    // We map the tokenId => their character attributes.
    nftCardHolderAttributes[newItemId] = BusinessCardAttributes({
      name: _attributes.name,
      imageURI: _attributes.imageURI,
      masters: _attributes.masters,
      skills: _attributes.skills
    });

    console.log("Minted Item NFT w/ tokenId %s", newItemId);

    // Increment the tokenId for the next person that uses it.
    _tokenIds.increment();

	  emit CardMinted(_msgSender(), newItemId, _quantity);
  }
  
  function uri(uint256 _tokenId) public view override returns (string memory) {
	  BusinessCardAttributes memory itemAttrib = nftCardHolderAttributes[_tokenId];
    string memory strMasters;
    for (uint i = 0; i < itemAttrib.masters.length; i++) { 
      if (i==0){
        strMasters = string(abi.encodePacked('{ "trait_type": "Master degree", "value": "',itemAttrib.masters[i],'"}'));
      }     
      else{
        strMasters = string(abi.encodePacked(strMasters,', { "trait_type": "Master degree", "value": "',itemAttrib.masters[i],'"}'));
      }
    }
    string memory strExp;
    for (uint i = 0; i < itemAttrib.skills.length; i++) { 
      if (i==0){
        strExp = string(abi.encodePacked(', { "trait_type": "Experience", "value": "',itemAttrib.skills[i],'"}'));
      }     
      else{
        strExp = string(abi.encodePacked(strExp,', { "trait_type": "Experience", "value": "',itemAttrib.skills[i],'"}'));
      }
    }
	  string memory json = Base64.encode(
      abi.encodePacked(
        '{"name": "',
        itemAttrib.name,
        ' Business Card #00',
        Strings.toString(_tokenId),
        '", "description": "NFT Business Card", "image": "ipfs://',
        itemAttrib.imageURI,
        '", "attributes": [ ',strMasters,strExp,']}'
      )
    );
    string memory output = string(
      abi.encodePacked("data:application/json;base64,", json)
      );
    console.log(output);
    return output;
  }

  function setContractURI(string calldata _contractURI) public onlyOwner {
      contractURI = _contractURI;
  }

  function receiveBusinessCard(uint256 _id) public {
    require(balanceOf(_msgSender(), _id) == 0,  "ERC1155: Caller already has this business card");
    require(balanceOf(owner(), _id) > 0,  "ERC1155: Owner is out of Business Card");
    _safeTransferFrom(owner(), _msgSender(), _id, 1, "");
    emit CardGiven(_msgSender(), _id, 1);
  }

  function setTrustedForwarder(address _trustedForwarder) public onlyOwner {
    trustedForwarder = _trustedForwarder;
  }

  function _msgSender() internal view virtual override(Context, ERC2771Context) returns (address sender) {
        if (isTrustedForwarder(msg.sender)) {
            /// @solidity memory-safe-assembly
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            return super._msgSender();
        }
    }

    function _msgData() internal view virtual override(Context, ERC2771Context) returns (bytes calldata) {
        if (isTrustedForwarder(msg.sender)) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }

    function versionRecipient() external pure returns (string memory) {
        return "1";
    }

}