import { ethers } from "ethers";
import abi from "../blockchain/contractABI.json"; 

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // contract address

export const getBlockchainContract = () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Ethereum wallet not found. Please install MetaMask.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, abi, signer);
};

export const storeGeneticData = async (dataHash: string, isAnonymized: boolean) => {
  try {
    const contract = getBlockchainContract();
    const tx = await contract.storeGeneticData(dataHash, isAnonymized);
    await tx.wait();
    console.log("Data stored successfully!");
  } catch (error) {
    console.error("Error storing genetic data:", error);
  }
};

export const getGeneticData = async (userAddress: string) => {
  try {
    const contract = getBlockchainContract();
    const data = await contract.getGeneticData(userAddress);
    return {
      dataHash: data[0],
      isAnonymized: data[1],
    };
  } catch (error) {
    console.error("Error fetching genetic data:", error);
    throw error;
  }
};