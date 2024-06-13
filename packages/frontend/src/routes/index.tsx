import { createAsync } from "@solidjs/router";
import { readContract } from "@wagmi/core";
import { For, Show, createSignal } from "solid-js";
import { Card } from "~/components/Card";
import Link from "~/components/Link";
import { noneMoneyAbi } from "~/generated";
import { useAccount } from "~/hooks/useAccount";
import { useConfig } from "~/hooks/useConfig";
import { fromUnix, toUnix } from "~/lib/unix";
import { Project } from "~/types";
import { contractAddress } from "~/wagmiConfig";
import { showProjectByHolders } from "~/data/showProjectByHolders";
import { formatEther } from "viem";

export default function () {
    const config = useConfig();
    const [account] = useAccount();

    const activeProjects = createAsync(async () => {
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

    const [showOwnProjects, setShowOwnProjects] = createSignal(false);

    const ownProjects = createAsync(async () => {
        if (account.status !== "connected") return;

        const projects = await showProjectByHolders(account.address).then(
            projects => projects.slice(0, 6)
        );

        setShowOwnProjects(projects.length > 0);

        return projects;
    });

    const [showSugarDaddy, setSugarDaddy] = createSignal(false);

    const sugarDaddy = createAsync(async () => {
        const data = await readContract(config, {
            abi: noneMoneyAbi,
            address: contractAddress,
            functionName: "getSugarDaddy"
        });

        setSugarDaddy(data.exist);

        return data;
    });

    return (
        <div class="mx-auto flex flex-col space-y-8 px-4 md:w-2/3 xl:w-1/2">
            <div>
                <div class="flex h-12 items-baseline justify-between font-mono md:mb-4">
                    <h1 class="text-2xl md:text-4xl">Active Projects</h1>
                    <p class="text-md md:text-lg">
                        <Link href="/projects">See all</Link>
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <For each={activeProjects()}>{Card}</For>
                </div>
            </div>

            <div>
                <Show when={showOwnProjects()}>
                    <div class="flex h-12 items-baseline justify-between font-mono md:mb-4">
                        <h1 class="text-2xl md:text-4xl">Your Projects</h1>
                        <p class="text-md md:text-lg">
                            <Link href="/projects/own">See all</Link>
                        </p>
                    </div>

                    <div class=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <For each={ownProjects()}>{Card}</For>
                    </div>
                </Show>
            </div>

            <div>
                <Show when={showSugarDaddy() && sugarDaddy()} keyed>
                    {sugarDaddy => (
                        <>
                            <div class="h-12 font-mono md:mb-4">
                                <h1 class="text-2xl md:text-4xl">
                                    BIG Sugar Daddy
                                </h1>
                            </div>

                            <p class="text-lg">
                                <code class="rounded-sm bg-neutral-200 px-1 dark:bg-neutral-700">
                                    {sugarDaddy.account}
                                </code>{" "}
                                donated {formatEther(sugarDaddy.donate_money)}{" "}
                                ETH in{" "}
                                <Link
                                    href={`/projects/${sugarDaddy.donate_project_id}`}
                                >
                                    Project{" "}
                                    {sugarDaddy.donate_project_id.toString()}
                                </Link>
                            </p>
                        </>
                    )}
                </Show>
            </div>
        </div>
    );
}
