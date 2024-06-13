import { createAsync } from "@solidjs/router";
import { For } from "solid-js";
import { Card } from "~/components/Card";
import { useAccount } from "~/hooks/useAccount";
import { useConfig } from "~/hooks/useConfig";
import { showProjectByHolders } from "~/data/showProjectByHolders";

export default function () {
    const config = useConfig();
    const [account] = useAccount();

    const projects = createAsync(async () => {
        if (account.status !== "connected") return;

        const projects = await showProjectByHolders(config, account.address);

        return projects;
    });

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
