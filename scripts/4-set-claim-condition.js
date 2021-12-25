import sdk from "./1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(
  "0xd21333588Bf433Ee27962775711B6BEa8cAcA943",
);

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
    // Specify conditions.
    claimConditionFactory.newClaimPhase({
        // Time when users are allowed to start minting NFTs
        startTime: new Date(),
        // Max # of membership NFTs that can be minted
        maxQuantity: 50_000,
        // Specify tokens someone can clain in a single transaction
        maxQuantityPerTransaction: 1,
    });
    
    
    await bundleDrop.setClaimCondition(0, claimConditionFactory);
    console.log("✅ Sucessfully set claim condition on bundle drop:", bundleDrop.address);
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})()