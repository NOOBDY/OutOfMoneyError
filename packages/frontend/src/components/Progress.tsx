import { Progress as KProgress } from "@kobalte/core/progress";

type Props = {
    current: number;
    goal: number;
};

export default function Progress(props: Props) {
    return (
        <KProgress
            value={(props.current / props.goal) * 100}
            class="flex flex-col"
        >
            <KProgress.Track class="h-2">
                <KProgress.Fill class="h-full w-[var(--kb-progress-fill-width)] bg-green-600 dark:bg-lime-400" />
            </KProgress.Track>
        </KProgress>
    );
}
