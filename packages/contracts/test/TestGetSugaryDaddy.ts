import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { addProject } from "./util";
import { getAddress } from "viem";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("GetSugerDaddy", () => {
    it("Test get contract should return sugarydaddy with have donor", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor1, donor2, donor3] =
            await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 10000n,
            account: donor1.account
        });
        await NoneMoney.write.donate([0n], {
            value: 80000n,
            account: donor2.account
        });
        await NoneMoney.write.donate([0n], {
            value: 10000n,
            account: donor3.account
        });

        const s = await NoneMoney.read.getSugerDaddy();

        expect(s.exit).to.be.true;
        expect(s.account).to.equal(getAddress(donor2.account.address));
        expect(s.donate_project_id).to.equal(0n);
        expect(s.donate_money).to.equal(80000n);
    });

    it("Test get contract should return sugarydaddy.exit is false without donor", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor1, donor2, donor3] =
            await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);

        const s = await NoneMoney.read.getSugerDaddy();

        expect(s.exit).to.be.false;
    });
});
