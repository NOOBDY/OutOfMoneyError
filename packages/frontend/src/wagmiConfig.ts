import { createConfig, http } from "@wagmi/core";
import { hardhat } from "@wagmi/core/chains";
import { defineChain } from "viem";

const hardhatConfig = createConfig({
    chains: [hardhat],
    ssr: true,
    transports: { [hardhat.id]: http() }
});

const xtt = defineChain({
    id: 1,
    name: "XTT",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://eth.noobdy.com"]
        }
    }
});

const xttConfig = createConfig({
    chains: [xtt],
    ssr: true,
    transports: { [xtt.id]: http() }
});

const dev = import.meta.env.VITE_DEV_MODE === "true";

export const contractAddress = dev
    ? "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    : "0xFA54F4e4677fD1595Ed19f1565CD37DD3B9e3E0A";

export const config = dev ? hardhatConfig : xttConfig;
