import { GetBalanceParameters, getBalance } from "@wagmi/core";
import { useConfig } from "./useConfig";
import { createResource } from "solid-js";

export function useBalance(props: GetBalanceParameters) {
    const config = useConfig();

    return createResource(async () =>
        getBalance(config, { address: props.address })
    );
}
