// api/mint.js
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

/**
 * Thirdweb SDK’yi, .env’de tanımlı PRIVATE_KEY ve Polygon RPC ile başlatıyoruz.
 * Vercel bu dosyayı serverless (Edge) fonksiyon olarak çalıştıracak.
 */
const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    process.env.PRIVATE_KEY,
    ethers.getDefaultProvider("https://polygon-rpc.com")
  )
);

/**
 * Serverless handler –  sadece POST isteklerini kabul eder
 * Body: { wallet, image, name, description }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { wallet, image, name, description } = req.body;

    // Koleksiyon adresi .env’de: NFT_CONTRACT_ADDRESS
    const contract = await sdk.getContract(process.env.NFT_CONTRACT_ADDRESS);

    // Mint işlemi
    const tx = await contract.erc721.mintTo(wallet, {
      name,
      description,
      image
    });

    // Başarılı yanıt
    return res.status(200).json({ success: true, tx });
  } catch (err) {
    // Hata yakalama
    return res.status(500).json({ error: err.message });
  }
}

