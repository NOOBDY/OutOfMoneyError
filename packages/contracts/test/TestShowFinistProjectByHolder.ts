import {
    loadFixture,
    time
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { addProject } from "./util";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("showFinistProjectByHolder", () => {
    it("Test show settable project for Holder should return correct project ID array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        // const now = BigInt(200n);
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 300000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.donate([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showFinistProjectByHolder({
            account: holder.account
        });
        expect(data[0].id).to.equal(0n);
    });
    it("Test show settable project for Holder after settle project should return correct project ID array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        // const now = BigInt(200n);
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 300000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.donate([1n], {
            value: 40000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.settleFinishProject([0n], {
            account: holder.account
        });

        const state = await NoneMoney.read.holder_is_return([0n], {
            account: holder.account
        });
        const data = await NoneMoney.read.showFinistProjectByHolder({
            account: holder.account
        });
        expect(data[0].id).to.equal(0n);
        expect(data[1].id).to.equal(1n);
        expect(data[0].is_return_by_account).to.be.true;
        expect(data[1].is_return_by_account).to.be.false;
    });
});
