import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { addProject } from "./util";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("GetContractBalance", () => {
    it("Test get contract balance should return correct balance", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 20000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.donate([1n], {
            value: 20000000000000000n,
            account: donor.account
        });

        const contractBalance = await NoneMoney.read.getContractBalance();

        expect(contractBalance).to.be.equal(40000000000000000n);
    });
});
