import { cache } from "@solidjs/router";
import { readContract } from "@wagmi/core";
import { Address } from "viem";
import { noneMoneyAbi } from "~/generated";
import { useConfig } from "~/hooks/useConfig";
import { fromUnix } from "~/lib/unix";
import { Project } from "~/types";
import { contractAddress } from "~/wagmiConfig";

export const showProjectByHolders = cache(async (address: Address) => {
    const config = useConfig();

    const now = new Date();

    const data = await readContract(config, {
        abi: noneMoneyAbi,
        address: contractAddress,
        functionName: "showProjectByHolders",
        args: [address]
    });

    const projects = data.map(v => {
        const deadline = fromUnix(v.deadline_timestamp);

        return {
            id: v.id,
            title: v.name,
            goal: v.target_money,
            current: v.get_money,
            deadline: deadline,
            state: v.state,
            owner: v.holder_account,
            donors: v.donor_arr,
            overdue: now > deadline
        } satisfies Project;
    });

    return projects;
}, "showProjectByHolders");
