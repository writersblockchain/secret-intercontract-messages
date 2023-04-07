import { SecretNetworkClient, Wallet } from "secretjs";
import * as fs from "fs";

const wallet = new Wallet(
  "shed clerk spray velvet flower tide cherry idea public solar prize tackle"
);

const contract_wasm = fs.readFileSync("../contract1.wasm.gz");

let codeId = 20633;

let contractCodeHash =
  "d4c3726d0d7e6d8e8ab87e28e895455a098492251da5411d99e1bb07a88b5c5c";

let contractAddress = "secret12kqwkp4uxp7858fsspqpda3dd3ra08d72nn2u4";

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-2",
  url: "https://api.pulsar.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

let upload_contract = async () => {
  let tx = await secretjs.tx.compute.storeCode(
    {
      sender: wallet.address,
      wasm_byte_code: contract_wasm,
      source: "",
      builder: "",
    },
    {
      gasLimit: 4_000_000,
    }
  );

  const codeId = Number(
    tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
      .value
  );

  console.log("codeId: ", codeId);

  const contractCodeHash = (
    await secretjs.query.compute.codeHashByCodeId({ code_id: codeId })
  ).code_hash;
  console.log(`Contract hash: ${contractCodeHash}`);
};

// upload_contract();

let instantiate_contract = async () => {
  // Create an instance of the Counter contract, providing a starting count

  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: {},
      label: "Counter Example - Submessages" + Math.ceil(Math.random() * 10000),
    },
    {
      gasLimit: 400_000,
    }
  );

  //Find the contract_address in the logs
  const contractAddress = tx.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;

  console.log(contractAddress);
};

// instantiate_contract();

let increase_count = async () => {
  const tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        increment_counter: {
          contract: "secret1edd6prk0w55c27dkcxzuau8mvlwa2rghgwelqk",
          code_hash:
            "cf6c359e936ded4e18716aafdef4d880cc42e4d87c29ca88205ff38c1ddf6531",
        },
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 100_000 }
  );

  console.log(tx);
};

increase_count();
