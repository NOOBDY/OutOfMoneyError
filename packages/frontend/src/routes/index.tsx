import { A } from "@solidjs/router";
import { For } from "solid-js";
import Progress from "~/components/Progress";
import { Project, data } from "~/db";

function Card(props: Project) {
    return (
        <div class="flex min-h-32 flex-col border font-mono">
            <div class="grow px-2 py-1">
                <h1>{props.title}</h1>
            </div>

            <div class="text-end">
                <A
                    href={`/projects/${props.id}`}
                    class="px-2 text-green-600 underline transition-all hover:text-green-800 dark:text-lime-400 dark:hover:text-lime-600"
                >
                    See more
                </A>
            </div>

            <Progress current={props.current} goal={props.goal} />
        </div>
    );
}

export default function () {
    return (
        <div class="mx-auto grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:w-2/3 lg:grid-cols-3">
            <For each={data}>{Card}</For>
        </div>
    );
}
