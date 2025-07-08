import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

const PRIVATE_KEY = process.env.PRIVATE_KEY?.trim() || "";
const SECRET_KEY  = process.env.THIRDWEB_SECRET_KEY?.trim() || "";

console.log("PK length:", PRIVATE_KEY.length); // 66
console.log("SK length:", SECRET_KEY.length);  // 40–50

// Chain seçimi – test için Mumbai'yi istersen aşağıdaki url'i değiştir
const provider = ethers.getDefaultProvider("https://polygon-rpc.com");

// Thirdweb SDK – en güncel biçim
const sdk = new ThirdwebSDK(
  new ethers.Wallet(PRIVATE_KEY, provider),
  { secretKey: SECRET_KEY }
);
