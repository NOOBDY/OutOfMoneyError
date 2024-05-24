import { A } from "@solidjs/router";
import { DarkModeToggle } from "~/components/DarkModeToggle";

export default function Nav() {
    return (
        <nav class="relative flex h-20 items-center justify-center">
            <A href="/" class="p-2">
                <h1 class="font-mono text-2xl">OutOfMoneyError</h1>
            </A>
            <div class="absolute right-0 p-4">
                <DarkModeToggle />
            </div>
        </nav>
    );
}
