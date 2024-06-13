import {
    loadFixture,
    time
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { addProject } from "./util";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("SettleOverdueProject", () => {
    it("Test settle overdue project with correct project ID should success", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor.account
        });
        const prevBalance = await ethers.provider.getBalance(
            donor.account.address
        );

        await NoneMoney.write.settleOverdueProject([0n, now], {
            account: donor.account
        });

        const donatedBalance = await ethers.provider.getBalance(
            donor.account.address
        );
        expect(prevBalance < donatedBalance).to.be.true;
    });
    it("Test settle overdue project with not completed settle should keep status CAN_DONATE", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor, donor2] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 5000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.donate([0n], {
            value: 5000000000000000n,
            account: donor2.account
        });

        await NoneMoney.write.settleOverdueProject([0n, now], {
            account: donor.account
        });

        const project = await NoneMoney.read.getProjectByID([0n]);
        expect(project.state).equal(0);
    });
    it("Test settle overdue project with completed settle should keep status EXPIRED_SETTLED", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor, donor2] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 5000000000000000n,
            account: donor.account
        });
        await NoneMoney.write.donate([0n], {
            value: 5000000000000000n,
            account: donor2.account
        });

        await NoneMoney.write.settleOverdueProject([0n, now], {
            account: donor.account
        });
        await NoneMoney.write.settleOverdueProject([0n, now], {
            account: donor2.account
        });

        const project = await NoneMoney.read.getProjectByID([0n]);
        expect(project.state).equal(2);
    });
    it("Test settle overdue project with negative project ID should be revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor.account
        });

        await expect(
            NoneMoney.write.settleOverdueProject([-1n, now], {
                account: donor.account
            })
        ).to.be.throw;
    });
    it("Test settle overdue project with absent project ID should be revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor.account
        });

        await expect(
            NoneMoney.write.settleOverdueProject([3n, now], {
                account: donor.account
            })
        ).to.be.throw;
    });
    it("Test settle overdue project with absent project ID should be revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor.account
        });

        await expect(
            NoneMoney.write.settleOverdueProject([3n, now], {
                account: donor.account
            })
        ).to.be.throw;
    });
    it("Test settle overdue project with repeat settle should revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        const now = BigInt(await time.latest());
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor.account
        });

        await NoneMoney.write.settleOverdueProject([0n, now], {
            account: donor.account
        });

        await expect(
            NoneMoney.write.settleOverdueProject([0n, now], {
                account: donor.account
            })
        ).to.be.throw;
    });
});
