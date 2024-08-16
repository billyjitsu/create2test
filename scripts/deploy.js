const { ethers, artifacts } = require("hardhat");

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);

const initialMessage = "Hello, Ethereum!";
const salt = ethers.keccak256(ethers.toUtf8Bytes("some_salt_value"));

async function main() {
  // Load the compiled contract's artifact
  const messageUpdaterArtifact = await artifacts.readArtifact("MessageUpdater");
  const factoryArtifact = await artifacts.readArtifact("Create2Factory");

  // Deploy the factory contract
  const factory = new ethers.ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode, signer);
  const factoryInstance = await factory.deploy();

  // Wait for the factory deployment transaction to be mined
  await factoryInstance.waitForDeployment();
  console.log("Factory deployed at:", factoryInstance.target);

  // Prepare the init code (bytecode + constructor arguments)
  const initCode = ethers.concat([
    messageUpdaterArtifact.bytecode,
    ethers.AbiCoder.defaultAbiCoder().encode(["string"], [initialMessage]),
  ]);

  // Predict the deployment address using the factory's method
  const predictedAddress = await factoryInstance.getDeployedAddress(salt, initCode);

  console.log("Predicted Deployment Address:", predictedAddress);

  // Deploy the contract using the factory and CREATE2
  const tx = await factoryInstance.deploy(initCode, salt);
  const receipt = await tx.wait();

//   console.log("Contract deployed at:", receipt);

  const deployedAddress = await factoryInstance.getDeployedAddress(salt, initCode);
    console.log("Deployed Address:", deployedAddress);
}

main().catch(console.error);



// const { ethers, artifacts } = require("hardhat");

// // Replace with your actual values
// const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
// const privateKey = process.env.PRIVATE_KEY;
// const signer = new ethers.Wallet(privateKey, provider);

// const initialMessage = "Hello, Ethereum!";
// const salt = ethers.keccak256(ethers.toUtf8Bytes("some_salt_value"));

// async function main() {
//   // Load the compiled contract's artifact
//   const messageUpdaterArtifact = await artifacts.readArtifact("MessageUpdater");
//   const factoryArtifact = await artifacts.readArtifact("Create2Factory");

//   // Deploy the factory contract first
//   const factory = new ethers.ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode, signer);
//   const factoryInstance = await factory.deploy();
  
//   // Wait for the factory deployment transaction to be mined
//   const factoryReceipt = await factoryInstance.deploymentTransaction().wait();

//   console.log("Factory deployed at:", factoryReceipt.contractAddress);

//   // Prepare the init code (bytecode + constructor arguments)
//   const initCode = ethers.concat([
//     messageUpdaterArtifact.bytecode,
//     ethers.AbiCoder.defaultAbiCoder().encode(["string"], [initialMessage]),
//   ]);

//   // Predict the deployment address
//   const deploymentAddress = ethers.getCreate2Address(
//     factoryReceipt.contractAddress,
//     salt,
//     ethers.keccak256(initCode)
//   );

//   console.log("Predicted Deployment Address:", deploymentAddress);

//   // Deploy the contract using the factory and CREATE2
//   const tx = await factoryInstance.deploy(initCode, salt);
//   const receipt = await tx.wait();

//   console.log("Contract deployed at:", receipt.events[0].args.addr);
// }

// main().catch(console.error);
///////////////////////////////////////////

// // import { ethers } from "ethers";
// const { ethers, artifacts } = require("hardhat");

// // Replace with your actual values
// const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
// const privateKey = process.env.PRIVATE_KEY;
// const signer = new ethers.Wallet(privateKey, provider);

// // ABI of the MessageUpdater contract
// const messageUpdaterABI = [
//   "constructor(string memory initialMessage)",
//   "function updateMessage(string memory newMessage) public",
//   "function getMessage() public view returns (string memory)",
// ];

// // Bytecode of the compiled MessageUpdater contract
// // const messageUpdaterBytecode = "YOUR_COMPILED_BYTECODE";

// // Example values
// const initialMessage = "Hello, Ethereum!";
// const salt = ethers.keccak256(ethers.toUtf8Bytes("some_salt_value"));

// async function main() {
//   // Load the compiled contract's artifact
//   const messageUpdaterArtifact = await artifacts.readArtifact("MessageUpdater");

//   // Get the bytecode from the artifact
//   const messageUpdaterBytecode = messageUpdaterArtifact.bytecode;

//   // console.log("Compiled Bytecode:", bytecode);

//   // Create the CREATE2 deployment address
//   // Prepare the init code (bytecode + constructor arguments)
//   const initCode = ethers.concat([
//     messageUpdaterBytecode,
//     ethers.AbiCoder.defaultAbiCoder().encode(["string"], [initialMessage]),
//   ]);

//   // Calculate the deployment address using CREATE2
//   const deploymentAddress = ethers.getCreate2Address(
//     signer.address,
//     salt,
//     ethers.keccak256(initCode)
//   );

//   console.log("Predicted Deployment Address:", deploymentAddress);

//   // Deploy the contract using CREATE2
//   const tx = await signer.sendTransaction({
//     data: initCode, // The bytecode and constructor arguments
//     gasLimit: 3000000, // Adjust according to your needs
//   });

//   console.log("Transaction Hash:", tx.hash);

//   // Wait for the transaction to be mined
//   const receipt = await tx.wait();
//   console.log("Contract deployed at:", receipt.contractAddress);
// }

// main().catch(console.error);
