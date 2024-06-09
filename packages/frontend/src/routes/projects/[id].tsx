import { createAsync, useParams } from "@solidjs/router";
import { readContract } from "@wagmi/core";
import { Show } from "solid-js";
import Progress from "~/components/Progress";
import { Project } from "~/db";
import { noneMoneyAbi } from "~/generated";
import { useConfig } from "~/hooks/useConfig";

function NotFound() {
    return (
        <div class="w-full py-40 text-center">
            <p class="font-mono text-7xl text-neutral-400 dark:text-neutral-600">
                Project Not Found
            </p>
        </div>
    );
}

export default function () {
    const params = useParams();
    const config = useConfig();

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const project = createAsync(async () => {
        const id = BigInt(params.id);
        const data = await readContract(config, {
            abi: noneMoneyAbi,
            address: contractAddress,
            functionName: "getProjectByID",
            args: [id]
        });

        return {
            id: id,
            title: data[0],
            description: data[1],
            goal: data[6],
            current: data[7]
        } satisfies Project;
    });

    return (
        <Show when={project()} fallback={<NotFound />} keyed>
            {project => (
                <div class="mx-auto px-4 lg:w-2/3">
                    <h1 class="mb-4 font-mono text-3xl font-semibold">
                        {project.title}
                    </h1>

                    <div class="flex w-full flex-col lg:flex-row">
                        <p class="mb-4 w-full grow break-words text-xl lg:mr-6 lg:w-3/5">
                            {project.description}
                        </p>

                        <div class="w-full lg:w-96">
                            <p class="text-md mb-4 font-mono">
                                <span class="text-2xl text-green-600 dark:text-lime-400">
                                    {project.current.toString()} ETH
                                </span>
                                {" of "}
                                {project.goal.toString()} ETH
                                {" raised"}
                            </p>
                            <div class="border">
                                <Progress
                                    current={Number(project.current)}
                                    goal={Number(project.goal)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Show>
    );
}
