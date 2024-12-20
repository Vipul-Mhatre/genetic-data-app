import { ethers } from "ethers";
import abi from "../blockchain/contractABI.json";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const getBlockchainContract = async () => {
  if (typeof window === "undefined") {
    throw new Error("This function must run in a browser environment.");
  }

  if (!window.ethereum) {
    alert("Ethereum wallet not detected. Please install MetaMask.");
    throw new Error("MetaMask or Ethereum provider not available.");
  }

  try {
    // Request MetaMask connection
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Initialize the provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    console.log("MetaMask connected. Provider and signer initialized.");
    return new ethers.Contract(contractAddress, abi, signer);
  } catch (error) {
    console.error("Error initializing blockchain contract:", error);
    throw error;
  }
};

export const storeGeneticData = async (dataHash: string, isAnonymized: boolean) => {
  try {
    const contract = await getBlockchainContract();
    console.log("Storing Data Hash:", dataHash, "Anonymized:", isAnonymized);
    const tx = await contract.storeGeneticData(dataHash, isAnonymized);
    console.log("Transaction Receipt:", await tx.wait());
  } catch (error) {
    console.error("Error storing genetic data:", error);
    throw error;
  }
};

export const getGeneticData = async (userAddress: string) => {
  try {
    const contract = await getBlockchainContract();
    console.log("Fetching Data for Address:", userAddress);
    const data = await contract.getGeneticData(userAddress);
    console.log("Retrieved Data:", data);
    return {
      dataHash: data[0],
      isAnonymized: data[1],
    };
  } catch (error) {
    console.error("Error fetching genetic data:", error);
    throw error;
  }
};