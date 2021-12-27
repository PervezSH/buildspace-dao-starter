import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0xd21333588Bf433Ee27962775711B6BEa8cAcA943",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Rick's Ship",
        description: "This NFT will give you access to SpaceDAO!",
        image: readFileSync("scripts/assets/ship.jpg"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()