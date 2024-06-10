import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { addProject } from "./util";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("ShowAllProject", () => {
    it("Test show all project should return correct project ID array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAllProject();

        expect(projects[0]).to.deep.equal([0n, 1n]);
    });
    it("Test show all project should return correct project name array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAllProject();

        expect(projects[1]).to.deep.equal(["name", "name"]);
    });
    it("Test show all project should return correct project start date array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAllProject();

        expect(projects[2]).to.deep.equal([100n, 100n]);
    });
    it("Test show all project should return correct project deadline array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAllProject();

        expect(projects[3]).to.deep.equal([100n, 100n]);
    });
    it("Test show all project should return correct project target_money array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAllProject();

        expect(projects[4]).to.deep.equal([
            20000000000000000n,
            20000000000000000n
        ]);
    });
    it("Test show all project should return correct project get_money array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAllProject();

        expect(projects[5]).to.deep.equal([0n, 0n]);
    });
});
