import { useEffect, useState } from "react";
import { getGeneticData, storeGeneticData } from "../utils/Blockchain";

interface GeneticData {
  dataHash: string;
  isAnonymized: boolean;
}

export default function Dashboard() {
  const [dataHash, setDataHash] = useState<string>("");
  const [isAnonymized, setIsAnonymized] = useState<boolean>(false);
  const [retrievedData, setRetrievedData] = useState<GeneticData | null>(null);

  const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress) {
        console.error("Wallet address is not defined in the environment variables.");
        return;
      }

      try {
        const data = await getGeneticData(walletAddress);
        setRetrievedData(data);
      } catch (error) {
        console.error("Error fetching genetic data:", error);
      }
    };

    fetchData();
  }, [walletAddress]);

  const handleStoreData = async () => {
    if (!dataHash) {
      alert("Please enter a valid data hash.");
      return;
    }

    try {
      await storeGeneticData(dataHash, isAnonymized);
      alert("Data stored successfully!");
      setRetrievedData({ dataHash, isAnonymized });
    } catch (error) {
      console.error("Error storing data:", error);
      alert("Failed to store data.");
    }
  };

  return (
    <div className="container mx-auto p-8 font-sans">
      <h1 className="text-center mb-8 text-2xl font-semibold">Dashboard</h1>

      <div className="card border border-gray-300 p-6 rounded-lg mb-8 bg-gray-100">
        <h2 className="mb-4 text-xl font-semibold">Your Genetic Data</h2>
        {retrievedData ? (
          <div>
            <p>Data Hash: {retrievedData.dataHash}</p>
            <p>Anonymized: {retrievedData.isAnonymized ? "Yes" : "No"}</p>
          </div>
        ) : (
          <p>No data available.</p>
        )}
      </div>

      <div className="uploadSection border border-gray-300 p-6 rounded-lg bg-white">
        <h2 className="mb-4 text-xl font-semibold">Upload New Genetic Data</h2>
        <input
          type="text"
          placeholder="Enter data hash (e.g., IPFS link)"
          value={dataHash}
          onChange={(e) => setDataHash(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        />
        <label className="block mb-4 text-lg">
          <input
            type="checkbox"
            checked={isAnonymized}
            onChange={() => setIsAnonymized(!isAnonymized)}
            className="mr-2"
          />
          Anonymize Data
        </label>
        <button
          onClick={handleStoreData}
          className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-800 transition duration-200"
        >
          Store Data
        </button>
      </div>
    </div>
  );
}
