import { createConfig, http } from "@wagmi/core";
import { sepolia, hardhat } from "@wagmi/core/chains";

export const sepoliaConfig = createConfig({
    chains: [sepolia],
    ssr: true,
    transports: { [sepolia.id]: http() }
});

export const hardhatConfig = createConfig({
    chains: [hardhat],
    ssr: true,
    transports: { [hardhat.id]: http() }
});

// TODO: create private chain config

// const xtt = defineChain({});

// export const xttConfig = createConfig({})
