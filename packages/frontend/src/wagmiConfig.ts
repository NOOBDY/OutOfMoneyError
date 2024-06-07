import { createConfig, http } from "@wagmi/core";
import { hardhat } from "@wagmi/core/chains";

export const config = createConfig({
    chains: [hardhat],
    ssr: true,
    transports: { [hardhat.id]: http() }
});

// TODO: create private chain config

// const xtt = defineChain({});

// export const xttConfig = createConfig({})
