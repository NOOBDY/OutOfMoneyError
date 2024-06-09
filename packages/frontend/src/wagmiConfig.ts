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
    : "0xA1969927F894eAaA5f03F4C8Aa7AF693Ba04626F";

export const config = dev ? hardhatConfig : xttConfig;
