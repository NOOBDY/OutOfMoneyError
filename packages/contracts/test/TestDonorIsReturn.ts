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

describe("Is_returned_donor", () => {
    it("Test is donor returned with settled project should return true", async () => {
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

        const state = await NoneMoney.read.is_returned_donor([0n], {
            account: donor.account
        });

        expect(state).to.be.true;
    });

    it("Test is donor returned with not settled project should return false", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000000000000000n,
            account: donor.account
        });

        const state = await NoneMoney.read.is_returned_donor([0n], {
            account: donor.account
        });

        expect(state).to.be.false;
    });

    it("Test is donor returned with the wrong donor project should revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor, donor2] = await hre.viem.getWalletClients();
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
            NoneMoney.read.is_returned_donor([0n], {
                account: donor2.account
            })
        ).to.be.throw;
    });
});
