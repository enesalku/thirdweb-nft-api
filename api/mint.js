import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

const PRIVATE_KEY = (process.env.PRIVATE_KEY || "").trim();
const SECRET_KEY  = (process.env.THIRDWEB_SECRET_KEY || "").trim();
const CLIENT_ID   = (process.env.THIRDWEB_CLIENT_ID || "").trim();

console.log("PK:", PRIVATE_KEY.length); // 66
console.log("SK:", SECRET_KEY.length);  // 40–50
console.log("CID:", CLIENT_ID.length);  // 32

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    PRIVATE_KEY,
    ethers.getDefaultProvider("https://polygon-rpc.com")
  ),
  {
    secretKey: SECRET_KEY,   // zorunlu (server-side)
    clientId : CLIENT_ID     // x-client-id başlığı için
  }
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  try {
    const { wallet, image, name, description } = req.body;
    if (!wallet || !image)
      return res.status(400).json({ error: "wallet & image required" });

    const contract = await sdk.getContract(process.env.NFT_CONTRACT_ADDRESS);
    const tx = await contract.erc721.mintTo(wallet, { name, description, image });

    return res.status(200).json({ success: true, tx });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
