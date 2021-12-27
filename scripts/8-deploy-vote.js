import sdk from "./1-initialize-sdk.js";

// App module address.
const appModule = sdk.getAppModule(
  "0xAFAcC701D24406e1a688Fb2D6e0740480499C961",
);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      // Governance contract a name.
      name: "SpaceDAO's Epic Proposals",

      // Location of our governance token, our ERC-20 contract!
      votingTokenAddress: "0x049514Be7C8F28C14B5643679C595bF870810791",

      // After a proposal is created, how long members have to wait to start voting
      proposalStartWaitTimeInSeconds: 0,

      // Voting time peroid
      proposalVotingTimeInSeconds: 24 * 60 * 60,

      // Minimum x % of token must be used in the vote
      votingQuorumFraction: 0,

      // The minimum # of tokens a user needs to create a proposal
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      "✅ Successfully deployed vote module, address:",
      voteModule.address,
    );
  } catch (err) {
    console.log("Failed to deploy vote module", err);
  }
})();
