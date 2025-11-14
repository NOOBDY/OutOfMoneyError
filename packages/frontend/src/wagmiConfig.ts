import { createConfig, http } from "@wagmi/core";
// import { hardhat } from "@wagmi/core/chains";
import { sepolia } from "@wagmi/core/chains";

export const config = createConfig({
    chains: [sepolia],
    ssr: true,
    transports: {
        [sepolia.id]: http(
            "https://sepolia.infura.io/v3/e6d6c5611b164df5b952b4fc227319f2"
        )
    }
});

//
// 這一行一定要有，不然前端 import 不到
export const contractAddress = "0xd9373b8b4B99Fd1F5B0017b51F8f7ED8547F7957";
