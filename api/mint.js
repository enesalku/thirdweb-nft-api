// api/mint.js
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

// ----- ENV değişkenlerini güvenle al -----
const PRIVATE_KEY  = (process.env.PRIVATE_KEY           || "").trim();      // 0x + 64 hex  → 66
const SECRET_KEY   = (process.env.THIRDWEB_SECRET_KEY   || "").trim();      // sk_live_...
const CLIENT_ID    = (process.env.THIRDWEB_CLIENT_ID    || "").trim();      // opsiyonel

// DEBUG: uzunluk kontrol (isteğe bağlı — sonra silebilirsin)
console.log("PK length :", PRIVATE_KEY.length);   // 66 olmalı
console.log("SK length :", SECRET_KEY.length);    // ~40–50 (varsa)
console.log("CID length:", CLIENT_ID.length);     // 32 (varsa)

// ----- Thirdweb SDK -----
const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    PRIVATE_KEY,
    ethers.getDefaultProvider("https://polygon-rpc.com")
  ),
  SECRET_KEY ? { secretKey: SECRET_KEY }          // server-side kimlik
             : { clientId: CLIENT_ID }            // fallback (front-end tarzı)
);

// ----- API handler -----
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
