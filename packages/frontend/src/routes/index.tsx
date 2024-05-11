import { Progress } from "@kobalte/core/progress";
import { For } from "solid-js";
import { Project, data } from "~/db";

function Card(props: Project) {
    return (
        <div class="group relative min-h-32">
            <div
                class="absolute flex min-h-32 flex-col border bg-white
                bg-opacity-100 font-mono text-black transition-all group-hover:z-10
                dark:bg-neutral-950 dark:text-white"
            >
                <div class="grow px-2 py-1">
                    <h1>{props.title}</h1>
                </div>

                <div
                    class="grid grid-rows-[0fr] transition-all
                    group-hover:grid-rows-[1fr]"
                >
                    <p class="overflow-hidden px-4 font-sans">
                        {props.description}
                    </p>
                </div>

                <Progress
                    value={(props.current / props.goal) * 100}
                    class="mt-4 flex flex-col"
                >
                    <Progress.Track class="h-2">
                        <Progress.Fill
                            class="h-full
                            w-[var(--kb-progress-fill-width)] bg-lime-400"
                        />
                    </Progress.Track>
                </Progress>
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <div
            class="mx-auto grid w-2/3 grid-cols-1
            gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
            <For each={data}>{Card}</For>
        </div>
    );
}
