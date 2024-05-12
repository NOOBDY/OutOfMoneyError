import {
    GetAccountReturnType,
    connect,
    disconnect,
    getAccount,
    injected,
    reconnect,
    watchAccount
} from "@wagmi/core";
import { onMount } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { useConfig } from "./useConfig";

type UseAccountReturnType = [
    GetAccountReturnType,
    { connect: () => Promise<void>; disconnect: () => Promise<void> }
];

export function useAccount(): UseAccountReturnType {
    const config = useConfig();
    const [account, setAccount] = createStore(getAccount(config));
    watchAccount(config, {
        onChange: account => setAccount(reconcile(account))
    });

    onMount(async () => {
        await reconnect(config, { connectors: [injected()] });
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
