import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";

// Import thirdweb
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

// Chain that support
// 4 = Rinkeby
const supportedChainIds = [4];

// Wallet that support
// Metamask which is an "injected wallet"
const connectors = {
  injected: {},
}

// Render the App component to the DOM
ReactDOM.render(
  <React.StrictMode>
    {/* Wrap app with ThirdwebWeb3Provider */}
    <ThirdwebWeb3Provider
      connectors = {connectors}
      supportedChainIds = {supportedChainIds}
    >
      <div  className="landing">
        <App/>
      </div>
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
