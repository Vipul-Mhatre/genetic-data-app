import { useState } from "react";
import { storeGeneticData, getGeneticData } from "../utils/Blockchain";
interface RetrievedData {
  dataHash: string;
  isAnonymized: boolean;
}

export default function TestBlockchain() {
  const [dataHash, setDataHash] = useState<string>(""); 
  const [isAnonymized, setIsAnonymized] = useState<boolean>(false); 
  const [retrievedData, setRetrievedData] = useState<RetrievedData | null>(null); 

  const handleStoreData = async () => {
    await storeGeneticData(dataHash, isAnonymized);
    alert("Data stored successfully!");
  };

  const handleRetrieveData = async () => {
    const walletAddress = process.env.WALLET_ADDRESS;
    
    if (!walletAddress) {
      alert("Wallet address is not defined in environment variables.");
      return;
    }
    
    const data = await getGeneticData(walletAddress); 
    setRetrievedData(data);
  };  

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test Blockchain Connection</h1>
      <div>
        <input
          type="text"
          placeholder="Enter data hash"
          value={dataHash}
          onChange={(e) => setDataHash(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={isAnonymized}
            onChange={() => setIsAnonymized(!isAnonymized)}
          />
          Anonymized
        </label>
        <button onClick={handleStoreData}>Store Data</button>
      </div>
      <div>
        <button onClick={handleRetrieveData}>Retrieve Data</button>
        {retrievedData && (
          <div>
            <p>Data Hash: {retrievedData.dataHash}</p>
            <p>Anonymized: {retrievedData.isAnonymized ? "Yes" : "No"}</p>
          </div>
        )}
      </div>
    </div>
  );
}