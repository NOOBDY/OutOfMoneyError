import { createConfig, http } from "@wagmi/core";
import { sepolia } from "@wagmi/core/chains";

export const sepoliaConfig = createConfig({
    chains: [sepolia],
    ssr: true,
    transports: { [sepolia.id]: http() }
});

// TODO: create private chain config
