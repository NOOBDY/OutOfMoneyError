import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

const setupExampleProject = async (NoneMoney: any, address: `0x${string}`) => {
    await NoneMoney.write.addProject(
        [
            "name", // _name:
            "description", // _description:
            100n, // _start_date:
            100n, // _deadline:
            20000000000000000n // _target_money:
        ],
        {
            account: address
        }
    );
    await NoneMoney.write.addProject(
        [
            "name", // _name:
            "description", // _description:
            100n, // _start_date:
            200n, // _deadline:
            10000000000000000n // _target_money:
        ],
        {
            account: address
        }
    );
};

describe("ShowAvailableProject", () => {
    it("Test show available project should return correct project ID", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await setupExampleProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAvailableProject([150n], {
            account: holder.account.address
        });

        expect(projects[0].id).to.be.equal(1n);
    });
    it("Test show available project should return correct name", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await setupExampleProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAvailableProject([150n], {
            account: holder.account.address
        });

        expect(projects[0].name).to.be.equal("name");
    });
    it("Test show available project should return correct description", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await setupExampleProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAvailableProject([150n], {
            account: holder.account.address
        });

        expect(projects[0].description).to.be.equal("description");
    });
    it("Test show available project should return correct state", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await setupExampleProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAvailableProject([150n], {
            account: holder.account.address
        });

        expect(projects[0].state).to.be.equal(0);
    });
    it("Test show available project should return correct start_date", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await setupExampleProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAvailableProject([150n], {
            account: holder.account.address
        });

        expect(projects[0].start_date).to.be.equal(100n);
    });
    it("Test show available project should return correct deadline", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await setupExampleProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAvailableProject([150n], {
            account: holder.account.address
        });

        expect(projects[0].deadline).to.be.equal(200n);
    });
    it("Test show available project should return correct target_money", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await setupExampleProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAvailableProject([150n], {
            account: holder.account.address
        });

        expect(projects[0].target_money).to.be.equal(10000000000000000n);
    });
    it("Test show available project should return correct get_money", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await setupExampleProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAvailableProject([150n], {
            account: holder.account.address
        });

        expect(projects[0].get_money).to.be.equal(0n);
    });
    it("Test show available project should return correct holder_account", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await setupExampleProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAvailableProject([150n], {
            account: holder.account.address
        });

        expect(projects[0].holder_account).to.be.equal(
            getAddress(holder.account.address)
        );
    });
});
