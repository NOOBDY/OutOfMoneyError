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

describe("ShowSettledProjectByAccount", () => {
    it("Test show settable project for donor should return correct project ID array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.donate([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showSettledProjectByAccount([now], {
            account: donor.account
        });

        expect(data[0].id).to.deep.equal(0n);
        expect(data[1].id).to.deep.equal(1n);
    });
    it("Test show settable project for donor should return correct project name array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.donate([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showSettledProjectByAccount([now], {
            account: donor.account
        });

        expect(data[0].name).to.deep.equal("name");
        expect(data[1].name).to.deep.equal("name");
    });
    it("Test show settable project for donor should return correct project start date array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.donate([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showSettledProjectByAccount([now], {
            account: donor.account
        });

        expect(data[0].start_date).to.deep.equal(100n);
        expect(data[1].start_date).to.deep.equal(100n);
    });
    it("Test show settable project for donor should return correct project deadline array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.donate([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showSettledProjectByAccount([now], {
            account: donor.account
        });

        expect(data[0].deadline).to.deep.equal(100n);
        expect(data[1].deadline).to.deep.equal(100n);
    });
    it("Test show settable project for donor should return correct project get_money array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.donate([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showSettledProjectByAccount([now], {
            account: donor.account
        });

        expect(data[0].get_money).to.deep.equal(10000000000000000n);
        expect(data[1].get_money).to.deep.equal(10000000000000000n);
    });
    it("Test show settable project for donor should return correct project target_money array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.donate([1n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const data = await NoneMoney.read.showSettledProjectByAccount([now], {
            account: donor.account
        });

        expect(data[0].target_money).to.deep.equal(20000000000000000n);
        expect(data[1].target_money).to.deep.equal(20000000000000000n);
    });
});
