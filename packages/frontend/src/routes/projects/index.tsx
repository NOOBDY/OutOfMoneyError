import { For } from "solid-js";
import Link from "~/components/Link";
import Progress from "~/components/Progress";
import { Project, data } from "~/db";

function Card(props: Project) {
    return (
        <div class="flex min-h-32 flex-col border font-mono">
            <div class="grow px-2 py-1">
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
    return (
        <div class="mx-auto grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:w-2/3 lg:grid-cols-3">
            <For each={data}>{Card}</For>
        </div>
    );
}
