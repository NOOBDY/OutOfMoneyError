import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";
import { addProject } from "./util";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("SortProjectDonorByDonateMoney", () => {
    it("Test sort porject donor by donate money should return correct value", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder, donor1, donor2] = await hre.viem.getWalletClients();
        await addProject(NoneMoney, holder.account.address);
        await NoneMoney.write.donate([0n], {
            value: 48763n,
            account: donor1.account.address
        })
        await NoneMoney.write.donate([0n], {
            value: 88888n,
            account: donor2.account.address
        })

        const donorRecordArray = await NoneMoney.read.sortProjectDonorByDonateMoney([0n], {
            account: holder.account.address
        })

        expect(donorRecordArray[0]).to.deep.equal([getAddress(donor2.account.address), getAddress(donor1.account.address)])
        expect(donorRecordArray[1]).to.deep.equal([88888n, 48763n])
    })
})