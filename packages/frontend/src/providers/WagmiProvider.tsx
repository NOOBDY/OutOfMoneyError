import type { Config, ResolvedRegister } from "@wagmi/core";
import { FlowProps, createContext } from "solid-js";

export const WagmiContext = createContext<Config>();

type Props = ResolvedRegister;

export function WagmiProvider(props: FlowProps<Props>) {
    // eslint-disable-next-line solid/reactivity
    const config = props.config;

    return (
        <WagmiContext.Provider value={config}>
            {props.children}
        </WagmiContext.Provider>
    );
}
