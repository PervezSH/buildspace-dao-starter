import { useEffect, useMemo, useState } from "react";
// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

// Instatiate the sdk on Rinkeby.
const sdk = new ThirdwebSDK("rinkeby");

// Grab reference to ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  "0xd21333588Bf433Ee27962775711B6BEa8cAcA943",
);

const App = () => {
  // Connect user's wallet using the connectWallet hook thirdweb gives us if user has connected to our web app
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address);

  // Signer to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  // State variable to know if user has NFT
  const [hasClaimedNFT, setHasClaimedNFT] = useState("false");
  // For loading state while the NFT is minting
  const [isClaiming, setIsClaiming] = useState(false);

  // Pass the signer to the sdk which enables us to interact with our deployed contact
  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  // Checks if user owns a membership nft
  useEffect(() => {
    if (!address) {
      return;
    }

    // Check is user has NFT, by using bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0, user has membership NFT
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  // If user hasn't connected their wallet before
  if (!address) {
    return(
      <div className="landing">
        <h1>
          Welcome to SpaceDAO
        </h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  // Show DAO dashboard if user has claimed membership nft
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1> 🛸DAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </div>
    );
  }

  // Mint membership nft for user
  const mintNFT = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet
    bundleDropModule
    .claim("0", 1)
    .catch((err) => {
      console.error("failed to claim", err);
      setIsClaiming(false);
    })
    .finally(() => {
      // Stop loading state.
      setIsClaiming(false);
      // Set claim state.
      setHasClaimedNFT(true);
      // Show user their fancy new NFT!
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`);
    });
  }

  // Render mint NFT screen
  return (
    <div className="mint-nft">
      <h1>Mint your free 🛸DAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNFT()}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;
