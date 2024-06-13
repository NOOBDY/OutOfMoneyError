import { A } from "@solidjs/router";
import { DarkModeToggle } from "~/components/DarkModeToggle";

export default function Nav() {
    return (
        <nav class="relative flex h-20 items-center justify-start px-2 md:justify-center">
            <A href="/" class="p-2">
                <h1 class="font-mono text-2xl">OutOfMoneyError</h1>
            </A>
            <div class="absolute right-0 flex items-baseline p-4">
                <div class="hidden md:block">
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
                <div class="block md:hidden">
                    <a
                        href="/projects/new"
                        class="min-w-32 border border-black px-2.5 pb-1 pt-0.5 font-mono
                        transition hover:border-green-600 hover:bg-green-600
                        disabled:border-neutral-200 disabled:bg-neutral-200
                        disabled:text-neutral-600 dark:border-white
                        dark:hover:border-lime-400 dark:hover:bg-lime-400
                        dark:hover:text-black dark:disabled:border-neutral-800
                        dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
                    >
                        +
                    </a>
                </div>
                <DarkModeToggle />
            </div>
        </nav>
    );
}
