import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { getAddress } from "viem";
import { addProject } from "./util";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("GetSettleableProjectCountAddition", () => {
    it("Test get the total donate of settable project for donor should return correct value", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.getSettleableProjectCountAddition({
            account: donor.account
        });

        expect(data[2]).to.equal(10000000000000000n);
    });
});
