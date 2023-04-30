const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const {METADATA_URL} = require("../constants");

async function main() {
    /*
    A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
    so whitelistContract here is a factory for instances of our Whitelist contract.
    */
    const lw3PunksContract = await ethers.getContractFactory("LW3Punks");
    const metadataURL = METADATA_URL;

  
    // here we deploy the contract
    const deployedLW3PunksContract = await lw3PunksContract.deploy(
      metadataURL
    );
    // 10 is the Maximum number of whitelisted addresses allowed
  
    // Wait for it to finish deploying
    await deployedLW3PunksContract.deployed();
  
    // print the address of the deployed contract
    console.log("LW3Punks Contract Address:", deployedLW3PunksContract.address);
  }
  
  // Call the main function and catch if there is any error
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });