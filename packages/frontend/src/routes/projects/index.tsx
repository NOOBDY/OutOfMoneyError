import { cache, createAsync } from "@solidjs/router";
import { readContract } from "@wagmi/core";
import { For } from "solid-js";
import { Project } from "~/types";
import { noneMoneyAbi } from "~/generated";
import { useConfig } from "~/hooks/useConfig";
import { contractAddress } from "~/wagmiConfig";
import { fromUnix } from "~/lib/unix";
import { Card } from "~/components/Card";

const showAllProject = cache(async () => {
    const config = useConfig();
    const data = await readContract(config, {
        abi: noneMoneyAbi,
        address: contractAddress,
        functionName: "showAllProject"
    });

    const now = new Date();

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
}, "showAllProject");

export default function () {
    const projects = createAsync(async () => showAllProject());

    return (
        <div class="mx-auto flex flex-col space-y-2 px-4 md:w-2/3 xl:w-1/2">
            <div class="flex h-12 items-baseline justify-between font-mono md:mb-4">
                <h1 class="text-2xl md:text-4xl">All Projects</h1>
            </div>

            <div class=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <For each={projects()}>{Card}</For>
            </div>
        </div>
    );
}
