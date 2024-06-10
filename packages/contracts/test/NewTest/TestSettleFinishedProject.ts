import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { addProject } from "./util";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("SettleFinishedProject", () => {
    it("Test settle finished project with finished status should success", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor1, donor2] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor1.account
        });
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor2.account
        });
        const prevBalance = await ethers.provider.getBalance(
            holder.account.address
        );

        await NoneMoney.write.settleFinishProject([0n], {
            account: holder.account
        });

        const settledBalance = await ethers.provider.getBalance(
            holder.account.address
        );
        expect(prevBalance < settledBalance).to.be.true;
    });
    it("Test settle finished project with unfinished status should revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor1] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor1.account
        });

        await expect(
            NoneMoney.write.settleFinishProject([0n], {
                account: holder.account
            })
        ).to.be.throw;
    });
    it("Test settle finished project with not-donor account should revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor1, donor2] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor1.account
        });

        await expect(
            NoneMoney.write.settleFinishProject([0n], {
                account: donor2.account
            })
        ).to.be.throw;
    });
    it("Test settle finished project with negative project ID should revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor1] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor1.account
        });

        await expect(
            NoneMoney.write.settleFinishProject([-1n], {
                account: holder.account
            })
        ).to.be.throw;
    });
    it("Test settle finished project with absent project ID should revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor1] = await hre.viem.getWalletClients();
        addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.addProjectDonor([0n], {
            value: 10000000000000000n,
            account: donor1.account
        });

        await expect(
            NoneMoney.write.settleFinishProject([3n], {
                account: holder.account
            })
        ).to.be.throw;
    });
});
