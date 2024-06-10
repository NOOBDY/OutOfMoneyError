import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { addProject } from "./util";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("ShowSettledProjectByAccount", () => {
    it("Test show settable project for donor should return correct project ID array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.addProjectDonor([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showSettledProjectByAccount({
            account: donor.account
        });

        expect(data[0]).to.deep.equal([0n, 1n]);
    });
    it("Test show settable project for donor should return correct project name array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.addProjectDonor([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showSettledProjectByAccount({
            account: donor.account
        });

        expect(data[1]).to.deep.equal(["name", "name"]);
    });
    it("Test show settable project for donor should return correct project start date array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.addProjectDonor([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showSettledProjectByAccount({
            account: donor.account
        });

        expect(data[2]).to.deep.equal([100n, 100n]);
    });
    it("Test show settable project for donor should return correct project deadline array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.addProjectDonor([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showSettledProjectByAccount({
            account: donor.account
        });

        expect(data[3]).to.deep.equal([100n, 100n]);
    });
    it("Test show settable project for donor should return correct project get_money array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.addProjectDonor([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showSettledProjectByAccount({
            account: donor.account
        });

        expect(data[4]).to.deep.equal([10000000000000000n, 10000000000000000n]);
    });
    it("Test show settable project for donor should return correct project donor_donate_money array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.addProjectDonor([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showSettledProjectByAccount({
            account: donor.account
        });

        expect(data[5]).to.deep.equal([10000000000000000n, 10000000000000000n]);
    });
});
