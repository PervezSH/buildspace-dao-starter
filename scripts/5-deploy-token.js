import sdk from "./1-initialize-sdk.js";

// In order to deploy the new contract we need our old friend the app module again.
const app = sdk.getAppModule("0xAFAcC701D24406e1a688Fb2D6e0740480499C961");

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      // Token's name Ex. "Ethereum"
      name: "SpaceDAO Governance Token",
      // Token's symbol? Ex. "ETH"
      symbol: "PICKLE",
    });
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenModule.address,
    );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();