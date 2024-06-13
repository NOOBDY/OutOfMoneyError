import { createAsync } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import { Card } from "~/components/Card";
import { useAccount } from "~/hooks/useAccount";
import { useConfig } from "~/hooks/useConfig";
import { showProjectByHolders } from "~/data/showProjectByHolders";

function NoProjects() {
    return (
        <div class="flex flex-col items-center">
            <h1 class="pb-20 pt-10 font-mono text-4xl text-neutral-400 dark:text-neutral-600">
                You don't have any projects currently
            </h1>

            <a
                href="/projects/new"
                class="min-w-32 border border-black px-4 pb-1 pt-0.5 font-mono
                transition hover:border-green-600 hover:bg-green-600
                disabled:border-neutral-200 disabled:bg-neutral-200
                disabled:text-neutral-600 dark:border-white
                dark:hover:border-lime-400 dark:hover:bg-lime-400
                dark:hover:text-black dark:disabled:border-neutral-800
                dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
            >
                New Project
            </a>
        </div>
    );
}

export default function () {
    const config = useConfig();
    const [account] = useAccount();

    const [showOwnProjects, setShowOwnProjects] = createSignal(false);

    const projects = createAsync(async () => {
        if (account.status !== "connected") return;

        const projects = await showProjectByHolders(config, account.address);

        setShowOwnProjects(projects.length > 0);

        return projects;
    });

    return (
        <div class="mx-auto flex flex-col space-y-2 px-4 md:w-2/3 xl:w-1/2">
            <Show when={showOwnProjects()} fallback={<NoProjects />}>
                <div class="flex h-12 items-baseline justify-between font-mono md:mb-4">
                    <h1 class="text-2xl md:text-4xl">All Projects</h1>
                </div>

                <div class=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <For each={projects()}>{Card}</For>
                </div>
            </Show>
        </div>
    );
}
