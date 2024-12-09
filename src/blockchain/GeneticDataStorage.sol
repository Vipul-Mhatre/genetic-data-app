// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GeneticDataStorage {
    struct GeneticData {
        address owner;
        string dataHash; // IPFS hash or similar
        bool isAnonymized;
    }

    mapping(address => GeneticData) private geneticDataMap;

    event DataStored(address indexed user, string dataHash, bool isAnonymized);
    event DataAccessed(address indexed user, address requester);

    function storeGeneticData(string memory dataHash, bool isAnonymized) public {
        geneticDataMap[msg.sender] = GeneticData(msg.sender, dataHash, isAnonymized);
        emit DataStored(msg.sender, dataHash, isAnonymized);
    }

    function getGeneticData(address user) public view returns (string memory, bool) {
        require(msg.sender == user, "Unauthorized access!");
        GeneticData memory data = geneticDataMap[user];
        return (data.dataHash, data.isAnonymized);
    }
}