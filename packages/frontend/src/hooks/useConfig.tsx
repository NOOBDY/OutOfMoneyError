import { useContext } from "solid-js";
import { WagmiContext } from "~/providers/WagmiProvider";

export function useConfig() {
    const config = useContext(WagmiContext);
    if (!config) {
        throw new Error("WagmiContext not found");
    }
    return config;
}
