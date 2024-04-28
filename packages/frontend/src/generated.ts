//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lockAbi = [
    {
        type: "constructor",
        inputs: [{ name: "_unlockTime", internalType: "uint256", type: "uint256" }],
        stateMutability: "payable"
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            { name: "amount", internalType: "uint256", type: "uint256", indexed: false },
            { name: "when", internalType: "uint256", type: "uint256", indexed: false }
        ],
        name: "Withdrawal"
    },
    {
        type: "function",
        inputs: [],
        name: "owner",
        outputs: [{ name: "", internalType: "address payable", type: "address" }],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [],
        name: "unlockTime",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
        stateMutability: "view"
    },
    { type: "function", inputs: [], name: "withdraw", outputs: [], stateMutability: "nonpayable" }
] as const;
