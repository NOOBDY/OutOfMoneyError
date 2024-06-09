import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const XTT_PRIVATE_KEY = vars.get("XTT_PRIVATE_KEY");

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        xtt: {
            url: "https://eth.noobdy.com",
            accounts: [XTT_PRIVATE_KEY]
        }
    }
};

export default config;
