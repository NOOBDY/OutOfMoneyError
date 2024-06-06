//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lockAbi = [
    {
        type: "constructor",
        inputs: [
            { name: "_unlockTime", internalType: "uint256", type: "uint256" }
        ],
        stateMutability: "payable"
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "amount",
                internalType: "uint256",
                type: "uint256",
                indexed: false
            },
            {
                name: "when",
                internalType: "uint256",
                type: "uint256",
                indexed: false
            }
        ],
        name: "Withdrawal"
    },
    {
        type: "function",
        inputs: [],
        name: "owner",
        outputs: [
            { name: "", internalType: "address payable", type: "address" }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [],
        name: "unlockTime",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable"
    }
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NoneMoney
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const noneMoneyAbi = [
    { type: "constructor", inputs: [], stateMutability: "payable" },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "success_holder",
                internalType: "bool",
                type: "bool",
                indexed: false
            }
        ],
        name: "give_money"
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "success_donor",
                internalType: "bool",
                type: "bool",
                indexed: false
            }
        ],
        name: "return_money"
    },
    {
        type: "function",
        inputs: [
            {
                name: "_holder_account",
                internalType: "address",
                type: "address"
            },
            { name: "_name", internalType: "string", type: "string" },
            { name: "_description", internalType: "string", type: "string" },
            { name: "_target_money", internalType: "uint256", type: "uint256" }
        ],
        name: "add_project",
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        inputs: [
            { name: "_project_id", internalType: "uint256", type: "uint256" }
        ],
        name: "add_project_donor",
        outputs: [],
        stateMutability: "payable"
    },
    {
        type: "function",
        inputs: [],
        name: "get_contract_balance",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [{ name: "_id", internalType: "uint256", type: "uint256" }],
        name: "search_project_by_id",
        outputs: [
            { name: "project_id", internalType: "uint256", type: "uint256" },
            { name: "_description", internalType: "string", type: "string" },
            { name: "_name", internalType: "string", type: "string" },
            {
                name: "holder_account",
                internalType: "address",
                type: "address"
            },
            { name: "state", internalType: "bool", type: "bool" },
            { name: "target_money", internalType: "uint256", type: "uint256" },
            { name: "get_money", internalType: "uint256", type: "uint256" }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [],
        name: "show_donate_projects_id",
        outputs: [
            {
                name: "_donate_projects_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [],
        name: "show_holders_account",
        outputs: [
            {
                name: "_holder_arr",
                internalType: "address[]",
                type: "address[]"
            }
        ],
        stateMutability: "view"
    }
] as const;
