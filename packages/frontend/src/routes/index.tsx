import { Progress } from "@kobalte/core/progress";
import { For } from "solid-js";
import { data } from "~/db";

function Card(props: (typeof data)[number]) {
    return (
        <div class="flex min-h-32 flex-col border font-mono">
            <div class="grow px-2 py-1">
                <h1>{props.title}</h1>
            </div>
            <Progress value={(props.current / props.goal) * 100} class="flex flex-col">
                <Progress.Track class="h-2">
                    <Progress.Fill class="h-full w-[var(--kb-progress-fill-width)] bg-lime-400" />
                </Progress.Track>
            </Progress>
        </div>
    );
}

export default function Home() {
    return (
        <div class="mx-auto grid w-2/3 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <For each={data}>{Card}</For>
        </div>
    );
}
