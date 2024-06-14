import { formatEther } from "viem";
import Link from "~/components/Link";
import Progress from "~/components/Progress";
import { Project } from "~/types";

export function Card(props: Project) {
    return (
        <div class="flex min-h-32 flex-col border font-mono">
            <div class="grow break-words px-2 py-1">
                <h1 class="font-bold">{props.title}</h1>
                <p class="text-sm">{props.deadline.toLocaleDateString()}</p>
            </div>

            <div class="px-2 text-end font-bold">
                <Link href={`/projects/${props.id}`}>See more</Link>
            </div>

            <Progress
                current={Number(formatEther(props.current))}
                goal={Number(formatEther(props.goal))}
                active={!props.overdue}
            />
        </div>
    );
}
