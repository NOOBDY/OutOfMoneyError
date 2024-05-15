import { For } from "solid-js";
import Link from "~/components/Link";
import Progress from "~/components/Progress";
import { Project, useProjects } from "~/db";

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
    const [projects] = useProjects();

    return (
        <div class="mx-auto px-4 lg:w-2/3">
            <Link href="/projects/new">Create new project</Link>

            <div class=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <For each={projects}>{Card}</For>
            </div>
        </div>
    );
}
