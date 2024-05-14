import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import Progress from "~/components/Progress";
import { useProjects } from "~/db";

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
    const [projects] = useProjects();

    const project = projects.find(p => p.id === Number.parseInt(params.id));

    return (
        <Show when={project} fallback={<NotFound />} keyed>
            {project => (
                <div class="mx-auto px-4 lg:w-2/3">
                    <h1 class="mb-4 font-mono text-3xl font-semibold">
                        {project.title}
                    </h1>

                    <div class="flex w-full flex-col lg:flex-row">
                        <p class="mb-4 w-full grow text-xl lg:mr-6 lg:w-3/5">
                            {project.description}
                        </p>

                        <div class="w-full lg:w-96">
                            <p class="text-md mb-4 font-mono">
                                <span class="text-2xl text-green-600 dark:text-lime-400">
                                    {project.current} ETH
                                </span>
                                {" of "}
                                {project.goal} ETH
                                {" raised"}
                            </p>
                            <div class="border">
                                <Progress
                                    current={project.current}
                                    goal={project.goal}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Show>
    );
}
