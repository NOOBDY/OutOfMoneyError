//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// INoneMoney
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iNoneMoneyAbi = [
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
    }
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NoneMoney
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const noneMoneyAbi = [
    { type: "constructor", inputs: [], stateMutability: "nonpayable" },
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
            { name: "_name", internalType: "string", type: "string" },
            { name: "_description", internalType: "string", type: "string" },
            { name: "_start_date", internalType: "uint256", type: "uint256" },
            { name: "_deadline", internalType: "uint256", type: "uint256" },
            { name: "_target_money", internalType: "uint256", type: "uint256" }
        ],
        name: "addProject",
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        inputs: [
            { name: "_project_id", internalType: "uint256", type: "uint256" }
        ],
        name: "addProjectDonor",
        outputs: [
            { name: "pay_success", internalType: "bool", type: "bool" },
            { name: "pay_money", internalType: "uint256", type: "uint256" }
        ],
        stateMutability: "payable"
    },
    {
        type: "function",
        inputs: [],
        name: "getContractBalance",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [],
        name: "getCurrentTimestamp",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [
            { name: "_project_id", internalType: "uint256", type: "uint256" }
        ],
        name: "getProjectByID",
        outputs: [
            { name: "name", internalType: "string", type: "string" },
            { name: "description", internalType: "string", type: "string" },
            {
                name: "holder_account",
                internalType: "address",
                type: "address"
            },
            { name: "state", internalType: "enum State", type: "uint8" },
            { name: "start_date", internalType: "uint256", type: "uint256" },
            { name: "deadline", internalType: "uint256", type: "uint256" },
            { name: "target_money", internalType: "uint256", type: "uint256" },
            { name: "get_money", internalType: "uint256", type: "uint256" },
            { name: "donor_arr", internalType: "address[]", type: "address[]" }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [],
        name: "getSettleableProjectCountAddition",
        outputs: [
            {
                name: "have_settled_project",
                internalType: "bool",
                type: "bool"
            },
            { name: "project_count", internalType: "uint256", type: "uint256" },
            { name: "sum_return", internalType: "uint256", type: "uint256" }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [
            { name: "_project_id", internalType: "uint256", type: "uint256" }
        ],
        name: "settleFinishProject",
        outputs: [
            { name: "clear_success", internalType: "bool", type: "bool" },
            { name: "get_money", internalType: "uint256", type: "uint256" }
        ],
        stateMutability: "payable"
    },
    {
        type: "function",
        inputs: [
            { name: "_project_id", internalType: "uint256", type: "uint256" }
        ],
        name: "settleOverdueProject",
        outputs: [
            { name: "clear_success", internalType: "bool", type: "bool" },
            {
                name: "addtional_money",
                internalType: "uint256",
                type: "uint256"
            }
        ],
        stateMutability: "payable"
    },
    {
        type: "function",
        inputs: [],
        name: "showAllProject",
        outputs: [
            {
                name: "_project_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            { name: "name_arr", internalType: "string[]", type: "string[]" },
            {
                name: "start_date_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            {
                name: "deadline_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            {
                name: "target_money_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            {
                name: "get_money_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [
            { name: "_account", internalType: "address", type: "address" }
        ],
        name: "showHoldersProject",
        outputs: [
            {
                name: "filterDeadline_id_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            { name: "name_arr", internalType: "string[]", type: "string[]" },
            { name: "state", internalType: "enum State[]", type: "uint8[]" },
            {
                name: "start_date_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            {
                name: "deadline_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            {
                name: "target_money_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            {
                name: "get_money_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [],
        name: "showProjectsFilterDeadline",
        outputs: [
            {
                name: "filterDeadline_id_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            { name: "name_arr", internalType: "string[]", type: "string[]" },
            {
                name: "start_date_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            {
                name: "deadline_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            {
                name: "target_money_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            {
                name: "get_money_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [],
        name: "showSettledProjectByAccount",
        outputs: [
            {
                name: "project_id_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            { name: "name_arr", internalType: "string[]", type: "string[]" },
            {
                name: "start_date_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            {
                name: "deadline_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            },
            { name: "get_money", internalType: "uint256[]", type: "uint256[]" },
            {
                name: "donor_donate_money",
                internalType: "uint256[]",
                type: "uint256[]"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        inputs: [
            { name: "_project_id", internalType: "uint256", type: "uint256" }
        ],
        name: "sortProjectDonorByDonateMoney",
        outputs: [
            {
                name: "sorted_donor_arr",
                internalType: "address[]",
                type: "address[]"
            },
            {
                name: "sorted_donate_money_arr",
                internalType: "uint256[]",
                type: "uint256[]"
            }
        ],
        stateMutability: "view"
    }
] as const;
