// api/mint.js
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

// 1) Private key'i güvenle al → trim ile gizli boşlukları at
const PRIVATE_KEY = (process.env.PRIVATE_KEY || "").trim();

// ► DEBUG: uzunluğu 66 mı?
console.log("PK length:", PRIVATE_KEY.length);   // 66 görmelisin

// 2) SDK'yı başlat
const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    PRIVATE_KEY,
    ethers.getDefaultProvider("https://polygon-rpc.com")
  )
);

/* … geri kalan kod aynı … */
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });
  try {
    const { wallet, image, name, description } = req.body;
    if (!wallet || !image) return res.status(400).json({ error: "wallet & image required" });

    const contract = await sdk.getContract(process.env.NFT_CONTRACT_ADDRESS);
    const tx = await contract.erc721.mintTo(wallet, { name, description, image });
    return res.status(200).json({ success: true, tx });
  } catch (err) {
    console.error(err);                // Vercel log'unda ayrıntı gör
    return res.status(500).json({ error: err.message });
  }
}
