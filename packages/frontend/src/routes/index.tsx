import { createAsync } from "@solidjs/router";
import { readContract } from "@wagmi/core";
import { For } from "solid-js";
import { Card } from "~/components/Card";
import Link from "~/components/Link";
import { noneMoneyAbi } from "~/generated";
import { useConfig } from "~/hooks/useConfig";
import { fromUnix, toUnix } from "~/lib/unix";
import { Project } from "~/types";
import { contractAddress } from "~/wagmiConfig";

export default function () {
    const config = useConfig();

    const projects = createAsync(async () => {
        const now = new Date();

        const data = await readContract(config, {
            abi: noneMoneyAbi,
            address: contractAddress,
            functionName: "showAvailableProject",
            args: [toUnix(now)]
        });

        const projects = data.slice(0, 6).map(v => {
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
    });

    return (
        <div class="mx-auto flex flex-col space-y-2 px-4 md:w-2/3 xl:w-1/2">
            <div class="flex h-12 items-baseline justify-between font-mono md:mb-4">
                <h1 class="text-2xl md:text-4xl">Active Projects</h1>
                <p class="text-md md:text-lg">
                    <Link href="/projects">All projects</Link>
                </p>
            </div>

            <div class=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <For each={projects()}>{Card}</For>
            </div>
        </div>
    );
}
