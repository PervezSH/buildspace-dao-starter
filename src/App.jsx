import { useEffect, useMemo, useState } from "react";
// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";

const App = () => {
  // Connect user's wallet using the connectWallet hook thirdweb gives us if user has connected to our web app
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

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

  // If user has connect their wallet
  return (
    <div className="landing">
      <h1>👀 wallet connected, now what!</h1>
    </div>
  );
};

export default App;
