import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0xAFAcC701D24406e1a688Fb2D6e0740480499C961");

(async () => {
    try {
      const bundleDropModule = await app.deployBundleDropModule({
        // The collection's name, ex. CryptoPunks
        name: "SpaceDAO Membership",
        // A description for the collection.
        description: "A DAO for Space Enthusiast.",
        // The image for the collection that will show up on OpenSea.
        image: readFileSync("scripts/assets/space.png"),
        // Set this to your own wallet address if you want to charge for the drop.
        primarySaleRecipientAddress: ethers.constants.AddressZero,
      });
      
      console.log(
        "✅ Successfully deployed bundleDrop module, address:",
        bundleDropModule.address,
      );
      console.log(
        "✅ bundleDrop metadata:",
        await bundleDropModule.getMetadata(),
      );
    } catch (error) {
      console.log("failed to deploy bundleDrop module", error);
    }
  })()