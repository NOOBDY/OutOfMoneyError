import {
    GetAccountReturnType,
    connect,
    disconnect,
    getAccount,
    injected,
    reconnect,
    watchAccount
} from "@wagmi/core";
import { onCleanup, onMount } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { useConfig } from "./useConfig";

type UseAccountReturnType = [
    GetAccountReturnType,
    { connect: () => Promise<void>; disconnect: () => Promise<void> }
];

export function useAccount(): UseAccountReturnType {
    const config = useConfig();
    const [account, setAccount] = createStore(getAccount(config));
    const unwatch = watchAccount(config, {
        onChange: account => setAccount(reconcile(account))
    });

    onMount(async () => {
        if (account.status === "connected") return;
        await reconnect(config, { connectors: [injected()] });
    });

    onCleanup(() => {
        unwatch();
    });

    const connectAccount = async () => {
        await connect(config, { connector: injected() });
    };

    const disconnectAccount = async () => {
        await disconnect(config);
    };

    return [
        account,
        {
            connect: connectAccount,
            disconnect: disconnectAccount
        }
    ];
}
