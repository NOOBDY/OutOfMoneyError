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

        expect(projects[0].id).to.be.equal(0n);
        expect(projects[1].id).to.be.equal(1n);
    });
    it("Test show all project should return correct project name array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAllProject();

        expect(projects[0].name).to.deep.equal("name");
        expect(projects[1].name).to.deep.equal("name");
    });
    it("Test show all project should return correct project start date array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAllProject();

        expect(projects[0].start_date_timestamp).to.deep.equal(100n);
        expect(projects[1].start_date_timestamp).to.deep.equal(100n);
    });
    it("Test show all project should return correct project deadline array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAllProject();

        expect(projects[0].deadline_timestamp).to.deep.equal(100n);
        expect(projects[1].deadline_timestamp).to.deep.equal(100n);
    });
    it("Test show all project should return correct project target_money array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAllProject();

        expect(projects[0].target_money).to.deep.equal(20000000000000000n);
        expect(projects[1].target_money).to.deep.equal(20000000000000000n);
    });
    it("Test show all project should return correct project get_money array", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await addProject(NoneMoney, holder.account.address);

        const projects = await NoneMoney.read.showAllProject();

        expect(projects[0].get_money).to.deep.equal(0n);
        expect(projects[1].get_money).to.deep.equal(0n);
    });
});
