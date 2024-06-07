import { createAsync } from "@solidjs/router";
import { readContract, simulateContract, writeContract } from "@wagmi/core";
import { For } from "solid-js";
import { parseEther } from "viem";
import { Button } from "~/components/Button";
import Link from "~/components/Link";
import Progress from "~/components/Progress";
import { Project, useProjects } from "~/db";
import { noneMoneyAbi } from "~/generated";
import { useAccount } from "~/hooks/useAccount";
import { useConfig } from "~/hooks/useConfig";

function Card(props: Project) {
    return (
        <div class="flex min-h-32 flex-col border font-mono">
            <div class="grow break-words px-2 py-1">
                <h1>{props.title}</h1>
            </div>

            <div class="px-2 text-end font-bold">
                <Link href={`/projects/${props.id}`}>See more</Link>
            </div>

            <Progress current={props.current} goal={props.goal} />
        </div>
    );
}

export default function () {
    const [mockProjects] = useProjects();

    const config = useConfig();
    const [account] = useAccount();

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const addProject = async () => {
        if (account.status === "connected") {
            console.log("add");
            try {
                const { request } = await simulateContract(config, {
                    abi: noneMoneyAbi,
                    address: contractAddress,
                    functionName: "add_project",
                    args: [
                        account.address,
                        "test",
                        "description",
                        parseEther("0.1")
                    ]
                });

                const hash = await writeContract(config, request);
                console.log(hash);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const projects = createAsync(async () => {
        const idArr = await readContract(config, {
            abi: noneMoneyAbi,
            address: contractAddress,
            functionName: "show_donate_projects_id"
        });

        const projects = await Promise.all(
            idArr.map(
                async id =>
                    await readContract(config, {
                        abi: noneMoneyAbi,
                        address: contractAddress,
                        functionName: "search_project_by_id",
                        args: [id]
                    })
            )
        );

        console.log(projects);

        return projects;
    });

    return (
        <>
            <div class="mx-auto px-4 lg:w-2/3">
                <Link href="/projects/new">Create new project</Link>

                <div class=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <For each={mockProjects}>{Card}</For>
                </div>
            </div>

            <div class="flex w-full items-center justify-center">
                <Button onClick={addProject}>Add project</Button>
            </div>
        </>
    );
}
