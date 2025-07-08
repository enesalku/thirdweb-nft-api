// api/mint.js
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

const PRIVATE_KEY = (process.env.PRIVATE_KEY || "").trim();
const SECRET_KEY  = (process.env.THIRDWEB_SECRET_KEY || "").trim();

console.log("PK length:", PRIVATE_KEY.length); // 66
console.log("SK length:", SECRET_KEY.length);  // >0 olmalı

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    PRIVATE_KEY,
    ethers.getDefaultProvider("https://polygon-rpc.com") // Mumbai testnet istiyorsan değiştir
  ),
  { secretKey: SECRET_KEY }        // <-- sadece bu parametre yeterli
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
