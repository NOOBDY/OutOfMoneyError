import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { getAddress } from "viem";
import { addProject } from "./util";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("Donate", () => {
    it("Test donate the project with correct value should success", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [ holder, donor ] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address)

        await expect(NoneMoney.write.addProjectDonor([0n], {
            value: 50n,
            account: donor.account
        })).to.be.not.throw
    })
    it("Test donate the project with correct value should add donor address", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [ holder, donor ] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address)

        await NoneMoney.write.addProjectDonor([0n], {
            value: 50n,
            account: donor.account
        })

        const project = await NoneMoney.read.getProjectByID([0n]);

        expect(project[8]).to.deep.equal([getAddress(donor.account.address)])
    })
    it("Test donate the project with correct value should add donor address", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [ holder, donor ] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address)

        await NoneMoney.write.addProjectDonor([0n], {
            value: 50n,
            account: donor.account
        })

        const project = await NoneMoney.read.getProjectByID([0n]);

        expect(project[8]).to.deep.equal([getAddress(donor.account.address)])
    })
    it("Test donate the project with correct value should add donor address into donor_map", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [ holder, donor ] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address)

        await NoneMoney.write.addProjectDonor([0n], {
            value: 50n,
            account: donor.account
        })

        const data = await NoneMoney.read.sortProjectDonorByDonateMoney([0n])
        expect(data[0][0]).to.deep.equal(getAddress(donor.account.address))
    })
    it("Test donate the project with correct value should add donor money into donor_map", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [ holder, donor ] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address)

        await NoneMoney.write.addProjectDonor([0n], {
            value: 50n,
            account: donor.account
        })

        const data = await NoneMoney.read.sortProjectDonorByDonateMoney([0n])
        expect(data[1][0]).to.deep.equal(50n)
    })
    it("Test donate the project with over-limit value should add donor money into donor_map", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [ holder, donor ] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address)

        await NoneMoney.write.addProjectDonor([0n], {
            value: 30000000000000000n,
            account: donor.account
        })

        const data = await NoneMoney.read.sortProjectDonorByDonateMoney([0n])
        expect(data[1][0]).to.deep.equal(20000000000000000n)
    })
    it("Test donate the project with over-limit value should revert over-limit money into donor balance", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [ holder, donor ] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address)

        await NoneMoney.write.addProjectDonor([0n], {
            value: 30000000000000000n,
            account: donor.account
        })

        const balance = await ethers.provider.getBalance(donor.account.address)
        expect(balance + 20000000000000000n < 10000000000000000000000n).be.true
    })
    it("Test donate the project with over-limit value should change project status into FINISH", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [ holder, donor ] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address)

        await NoneMoney.write.addProjectDonor([0n], {
            value: 30000000000000000n,
            account: donor.account
        })

        const project = await NoneMoney.read.getProjectByID([0n]);
        expect(project[3]).equal(1)
    })
    it("Test donate the project with correct value should have correct get_money", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [ holder, donor ] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address)

        await NoneMoney.write.addProjectDonor([0n], {
            value: 50n,
            account: donor.account
        })

        const project = await NoneMoney.read.getProjectByID([0n]);
        expect(project[7]).be.equal(50n)
    })
    it("Test donate the project with zero value should be revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [ holder, donor ] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address)

        await expect(NoneMoney.write.addProjectDonor([0n], {
            value: 0n,
            account: donor.account
        })).to.be.throw
    })
    it("Test donate the project with negative projectId should be revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [ holder, donor ] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address)

        await expect(NoneMoney.write.addProjectDonor([-1n], {
            value: 0n,
            account: donor.account
        })).to.be.throw
    })
    it("Test donate the project with absent projectId should be revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [ holder, donor ] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address)

        await expect(NoneMoney.write.addProjectDonor([3n], {
            value: 0n,
            account: donor.account
        })).to.be.throw
    })
})