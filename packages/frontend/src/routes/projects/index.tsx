import { createAsync } from "@solidjs/router";
import { readContract } from "@wagmi/core";
import { For } from "solid-js";
import { formatEther } from "viem";
import Link from "~/components/Link";
import Progress from "~/components/Progress";
import { Project } from "~/db";
import { noneMoneyAbi } from "~/generated";
import { useConfig } from "~/hooks/useConfig";
import { contractAddress } from "~/wagmiConfig";

function Card(props: Project) {
    return (
        <div class="flex min-h-32 flex-col border font-mono">
            <div class="grow break-words px-2 py-1">
                <h1>{props.title}</h1>
            </div>

            <div class="px-2 text-end font-bold">
                <Link href={`/projects/${props.id}`}>See more</Link>
            </div>

            <Progress
                current={Number(formatEther(props.current))}
                goal={Number(formatEther(props.goal))}
            />
        </div>
    );
}

export default function () {
    const config = useConfig();

    const projects = createAsync(async () => {
        const data = await readContract(config, {
            abi: noneMoneyAbi,
            address: contractAddress,
            functionName: "showAllProject"
        });

        const projects = data[0].map((v, i) => {
            return {
                id: v,
                title: data[1][i],
                goal: data[4][i],
                current: data[5][i]
            } satisfies Project;
        });

        return projects;
    });

    return (
        <>
            <div class="mx-auto px-4 lg:w-2/3">
                <Link href="/projects/new">Create new project</Link>

                <div class=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <For each={projects()}>{Card}</For>
                </div>
            </div>
        </>
    );
}
