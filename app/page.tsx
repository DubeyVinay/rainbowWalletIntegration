"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";
import abi from "./utils/contractAbi.json";
import { useState } from "react";
export default function Home() {
  // const { active } = useWeb3React();
  const { address } = useAccount();
  console.log(address);
  const [value, setValue] = useState({
    to: "",
    amount: 0,
  });
  const [balance, setBalance] = useState<bigint>();
  const { config } = usePrepareContractWrite({
    address: "0x02CE860e119581d4634611f3d926E02D997004c9",
    abi: [
      {
        name: "transfer",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
      },
    ],
    functionName: "transfer",
    args: [value.to, value.amount],
  });

  const { write } = useContractWrite(config);
  const transferAmount = (e: any) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const { data } = useContractRead({
    address: "0x02CE860e119581d4634611f3d926E02D997004c9",
    abi: abi,
    functionName: "balanceOf",
    args: [address],
  });
  console.log(balance);
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <ConnectButton />
      <div>
        <h3 className="mt-10">Transfer Amount</h3>

        <div className="flex my-10">
          <input
            value={value.to}
            name="to"
            type="text"
            placeholder="Enter Receiver address"
            className="p-2 mr-5"
            onChange={(e) => {
              transferAmount(e);
            }}
          />
          <input
            type="number"
            name="amount"
            placeholder="Enter Amount"
            className="p-2"
            value={value.amount}
            onChange={(e) => {
              transferAmount(e);
            }}
          />
        </div>
        <div className="text-center">
          <button
            onClick={() => {
              write?.();
            }}
            className="p-2 bg-fuchsia-950 text-white font-bold text-lg rounded"
          >
            Transfer
          </button>
        </div>

        <div className="text-center mt-20">
          <h3>{balance !== undefined ? balance.toString() : ""}</h3>

          <button
            onClick={() => {
              debugger;
              console.log(typeof data === "bigint");
              setBalance(typeof data === "bigint" ? data : undefined);
              console.log(balance);
            }}
            className="p-2 bg-fuchsia-950 text-white font-bold text-lg rounded"
          >
            Get Balance
          </button>
        </div>
      </div>
    </main>
  );
}
