import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

async function deployMainContract() {
    return await hre.viem.deployContract("NoneMoney", [], {});
}

describe("Add Project", () => {
    it("Test to add the project with correct data should success", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();

        await expect(
            NoneMoney.write.addProject(
                [
                    "name", // _name:
                    "description", // _description:
                    100n, // _start_date:
                    100n, // _deadline:
                    20000000000000000n // _target_money:
                ],
                {
                    account: holder.account.address
                }
            )
        ).to.not.be.reverted;
    });
    it("Test to add the project with correct parameter should have correct name", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await NoneMoney.write.addProject(
            [
                "name", // _name:
                "description", // _description:
                100n, // _start_date:
                100n, // _deadline:
                20000000000000000n // _target_money:
            ],
            {
                account: holder.account.address
            }
        );

        const project = await NoneMoney.read.getProjectByID([0n]);

        expect(project.name).to.equal("name");
    });
    it("Test to add the project with correct parameter should have correct description", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await NoneMoney.write.addProject(
            [
                "name", // _name:
                "description", // _description:
                100n, // _start_date:
                100n, // _deadline:
                20000000000000000n // _target_money:
            ],
            {
                account: holder.account.address
            }
        );

        const project = await NoneMoney.read.getProjectByID([0n]);

        expect(project.description).to.equal("description");
    });
    it("Test to add the project with correct parameter should have correct holder_account", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await NoneMoney.write.addProject(
            [
                "name", // _name:
                "description", // _description:
                100n, // _start_date:
                100n, // _deadline:
                20000000000000000n // _target_money:
            ],
            {
                account: holder.account.address
            }
        );

        const project = await NoneMoney.read.getProjectByID([0n]);

        expect(project.holder_account).to.equal(
            getAddress(holder.account.address)
        );
    });
    it("Test to add the project with correct parameter should have correct state", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await NoneMoney.write.addProject(
            [
                "name", // _name:
                "description", // _description:
                100n, // _start_date:
                100n, // _deadline:
                20000000000000000n // _target_money:
            ],
            {
                account: holder.account.address
            }
        );

        const project = await NoneMoney.read.getProjectByID([0n]);

        expect(project.state).to.equal(0); // CAN_DONATE
    });
    it("Test to add the project with correct parameter should have correct _start_date", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await NoneMoney.write.addProject(
            [
                "name", // _name:
                "description", // _description:
                100n, // _start_date:
                100n, // _deadline:
                20000000000000000n // _target_money:
            ],
            {
                account: holder.account.address
            }
        );

        const project = await NoneMoney.read.getProjectByID([0n]);

        expect(project.start_date_timestamp).to.equal(100n);
    });
    it("Test to add the project with correct parameter should have correct _deadline", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await NoneMoney.write.addProject(
            [
                "name", // _name:
                "description", // _description:
                100n, // _start_date:
                100n, // _deadline:
                20000000000000000n // _target_money:
            ],
            {
                account: holder.account.address
            }
        );

        const project = await NoneMoney.read.getProjectByID([0n]);

        expect(project.deadline_timestamp).to.equal(100n);
    });
    it("Test to add the project with correct parameter should have correct _target_money", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await NoneMoney.write.addProject(
            [
                "name", // _name:
                "description", // _description:
                100n, // _start_date:
                100n, // _deadline:
                20000000000000000n // _target_money:
            ],
            {
                account: holder.account.address
            }
        );

        const project = await NoneMoney.read.getProjectByID([0n]);

        expect(project.target_money).to.equal(20000000000000000n);
    });
    it("Test to add the project with correct parameter should have correct get_money", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await NoneMoney.write.addProject(
            [
                "name", // _name:
                "description", // _description:
                100n, // _start_date:
                100n, // _deadline:
                20000000000000000n // _target_money:
            ],
            {
                account: holder.account.address
            }
        );

        const project = await NoneMoney.read.getProjectByID([0n]);

        expect(project.get_money).to.equal(0n);
    });
    it("Test to add the project with correct parameter should have correct donor_arr", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();
        await NoneMoney.write.addProject(
            [
                "name", // _name:
                "description", // _description:
                100n, // _start_date:
                100n, // _deadline:
                20000000000000000n // _target_money:
            ],
            {
                account: holder.account.address
            }
        );

        const project = await NoneMoney.read.getProjectByID([0n]);

        expect(project.donor_arr).to.deep.equal([]);
    });
    it("Test to add the project with empty name should be revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();

        await expect(
            NoneMoney.write.addProject(
                [
                    "", // _name:
                    "description", // _description:
                    100n, // _start_date:
                    100n, // _deadline:
                    20000000000000000n // _target_money:
                ],
                {
                    account: holder.account.address
                }
            )
        ).to.be.throw;
    });
    it("Test to add the project with not enough money should be revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();

        await expect(
            NoneMoney.write.addProject(
                [
                    "name", // _name:
                    "description", // _description:
                    100n, // _start_date:
                    100n, // _deadline:
                    0n // _target_money:
                ],
                {
                    account: holder.account.address
                }
            )
        ).to.be.throw;
    });
    it("Test to add the project with zero deadline should be revert", async () => {
        const NoneMoney = await loadFixture(deployMainContract);
        const [holder] = await hre.viem.getWalletClients();

        await expect(
            NoneMoney.write.addProject(
                [
                    "name", // _name:
                    "description", // _description:
                    100n, // _start_date:
                    0n, // _deadline:
                    20000000000000000n // _target_money:
                ],
                {
                    account: holder.account.address
                }
            )
        ).to.be.throw;
    });
});
