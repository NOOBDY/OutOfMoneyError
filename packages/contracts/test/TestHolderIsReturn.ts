import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { addProject } from "./util";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("HolderIsReturn", () => {
    it("Test holder is this project holder settled is return true", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor1, donor2] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor1.account
        });
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor2.account
        });

        await NoneMoney.write.settleFinishProject([0n], {
            account: holder.account
        });

        const state = await NoneMoney.read.holder_is_return([0n], {
            account: holder.account
        });

        expect(state).to.be.true;
    });

    it("Test holder is this project holder not settled is return false", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor1, donor2] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor1.account
        });
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor2.account
        });

        const state = await NoneMoney.read.holder_is_return([0n], {
            account: holder.account
        });

        expect(state).to.be.false;
    });

    it("Test holder is not this project holder is revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, holder2, donor1, donor2] =
            await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor1.account
        });
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor2.account
        });

        await NoneMoney.write.settleFinishProject([0n], {
            account: holder.account
        });

        await expect(
            NoneMoney.read.holder_is_return([0n], {
                account: holder2.account
            })
        ).to.be.throw;
    });
});
