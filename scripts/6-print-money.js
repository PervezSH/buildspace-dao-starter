import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is the address of our ERC-20 contract
const tokenModule = sdk.getTokenModule(
  "0x049514Be7C8F28C14B5643679C595bF870810791",
);

(async () => {
  try {
    // The max supply 1,000,000 is a nice number!
    const amount = 1_000_000;
    // Concert the amount to have 18 decimals (which is the standard for ERC20 tokens).
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
    // Interact with your deployed ERC-20 contract and mint the tokens!
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();
    
    // Print out how many of our token's are out there now!
    console.log(
      "✅ There now is",
      ethers.utils.formatUnits(totalSupply, 18),
      "$PICKLE in circulation",
    );
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();