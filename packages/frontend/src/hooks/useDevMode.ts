import { useSearchParams } from "@solidjs/router";
import { createMemo } from "solid-js";

export function useDevMode() {
    const [searchParams] = useSearchParams();

    const devMode = createMemo(() => searchParams.dev === "1");

    return devMode;
}
