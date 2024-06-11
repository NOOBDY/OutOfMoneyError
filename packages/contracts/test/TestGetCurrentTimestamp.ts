import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("GetCurrentTimestamp", () => {
    it("Test get contract timestamp should return correct timestamp", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const contractTimestamp = await NoneMoney.read.getCurrentTimestamp();
        const latestBlockTimestamp = (
            await hre.ethers.provider.getBlock("latest")
        )?.timestamp!;

        expect(contractTimestamp).to.be.equals(BigInt(latestBlockTimestamp));
    });
});
