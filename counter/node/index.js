import { SecretNetworkClient, Wallet } from "secretjs";
import * as fs from "fs";

const wallet = new Wallet(
  "shed clerk spray velvet flower tide cherry idea public solar prize tackle"
);

const contract_wasm = fs.readFileSync("../optimized-wasm/secret_contract_example.wasm.gz");

let codeId = 12166;
let contractCodeHash =
  "335855599c7c67d85f8db4450b4753bb69c51d7848998f46fd06f327d04bd03d";

let contractAddress = "secret1r72hknqxzctrvg8lxx4ewdz6cg06w047yzr7ua";

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://lcd.testnet.secretsaturn.net",
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
  const initMsg = { count: 0 };
  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: initMsg,
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

let query_count = async () => {
  const count = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      get_count: {},
    },
    code_hash: contractCodeHash,
  });

  console.log(count);
};
query_count();
