import { useEffect, useMemo, useState } from "react";
// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";

// Instatiate the sdk on Rinkeby.
const sdk = new ThirdwebSDK("rinkeby");

// Grab reference to ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  "0xd21333588Bf433Ee27962775711B6BEa8cAcA943",
);
// Grab reference to ERC-20 token module
const tokenModule = sdk.getTokenModule(
  "0x049514Be7C8F28C14B5643679C595bF870810791"
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

  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState([]);

  // Function to shorten someones wallet address, no need to show the whole thing. 
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // This useEffect grabs all our the addresses of our members holding our NFT
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab the users who hold our NFT
    // with tokenId 0
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresess) => {
        console.log("🚀 Members addresses", addresess)
        setMemberAddresses(addresess);
      })
      .catch((err) => {
        console.error("failed to get member list", err);
      });
  },[hasClaimedNFT]);

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab all the balances.
    tokenModule
    .getAllHolderBalances()
    .then((amounts) => {
      console.log("👜 Amounts", amounts)
      setMemberTokenAmounts(amounts);
    })
    .catch((err) => {
      console.error("failed to get token amounts", err);
    });
  }, [hasClaimedNFT]);

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

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
        <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
