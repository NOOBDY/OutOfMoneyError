import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-chai-matchers";

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        hardhat: {}, // 本地虛擬鏈
        localhost: {
            // 連 npx hardhat node
            url: "http://127.0.0.1:8545"
        }
    }
};
export default config;
