import { A } from "@solidjs/router";

export default function Nav() {
    return (
        <nav class="flex h-20 items-center justify-center">
            <A href="/" class="p-2">
                <h1 class="font-mono text-2xl">OutOfMoneyError</h1>
            </A>
        </nav>
    );
}
