import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { boolean } from "hardhat/internal/core/params/argumentTypes";
import { getAddress } from "viem";

describe("test NoneMoney contract", function () {
    async function depolyMainContract() {
        const NoneMoney = await hre.viem.deployContract("NoneMoney", [], {});

        return {
            NoneMoney
        };
    }

    describe("Deployment", function () {
        it("work", async function () {
            await loadFixture(depolyMainContract);
        });
    });

    describe("Add", function () {
        it("addProject", async function () {
            //加入project
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                [
                    //  _holder_account:
                    "name", // _name:
                    "description", // _description:
                    BigInt(100), // _start_date:
                    BigInt(100), // _deadline:
                    BigInt(1) // _target_money:
                ],
                {
                    account: holder.account.address
                }
            );
            const project = await NoneMoney.read.getProjectByID([BigInt(0)]);

            expect(project[0]).to.equal("name");
            expect(project[1]).to.equal("description");
            expect(project[2]).to.equal(getAddress(holder.account.address));
            expect(project[3]).to.equal(0); //state
            expect(project[4]).to.equal(100n); //start_date
            expect(project[5]).to.equal(100n); //deadline
            expect(project[6]).to.equal(1n); //target
            expect(project[7]).to.equal(0n); //get
        });

        it("addProjectDonor", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder, donor] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(100), BigInt(200)],
                {
                    account: holder.account.address
                }
            ); //project_id = 0;
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(50),
                account: donor.account
            });

            const project = await NoneMoney.read.getProjectByID([BigInt(0)]);

            expect(project[0]).to.equal("project"); //project_name
            expect(project[1]).to.equal("test"); //project_description
            expect(project[2]).to.equal(getAddress(holder.account.address));
            expect(project[3]).to.equal(0); //state false:open true:finish
            expect(project[6]).to.equal(200n); //target
            let donate = Math.floor(50 * 0.95);
            expect(project[7]).to.equal(BigInt(donate)); //get
        });
    });

    describe("ToSettleProject", function () {
        it("settleProject", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder, donor1, donor2, donor3] =
                await hre.viem.getWalletClients();
            const publicClient = await hre.viem.getPublicClient();

            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(100), BigInt(2000)],
                {
                    account: holder.account.address
                }
            ); //project_id = 0;
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(70),
                account: donor1.account
            });
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(300),
                account: donor2.account
            });
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(100),
                account: donor3.account
            });

            const donor1_before_balance = await publicClient.getBalance({
                address: donor1.account.address
            });
            const donor2_before_balance = await publicClient.getBalance({
                address: donor2.account.address
            });

            await NoneMoney.write.settleProject([BigInt(0)], {
                account: donor3.account
            });

            const donor1_after_belence = await publicClient.getBalance({
                address: donor1.account.address
            });
            const donor2_after_belence = await publicClient.getBalance({
                address: donor2.account.address
            });

            let return_money =
                donor1_before_balance + BigInt(Math.floor(70 * 0.95));
            expect(donor1_after_belence).to.equal(return_money); //project_name

            return_money =
                donor2_before_balance + BigInt(Math.floor(300 * 0.95));
            expect(donor2_after_belence).to.equal(return_money); //project_description
        });

        it("getSettleableProjectCountAddition", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder, donor] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test1", BigInt(100), BigInt(100), BigInt(200)],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(100),
                account: donor.account
            });

            await NoneMoney.write.addProject(
                ["project", "test2", BigInt(100), BigInt(100), BigInt(200)],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.addProject(
                ["project", "test3", BigInt(100), BigInt(100), BigInt(200)],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProjectDonor([BigInt(2)], {
                value: BigInt(200),
                account: donor.account
            });

            const project1 = await NoneMoney.read.getProjectByID([BigInt(0)]);
            const project3 = await NoneMoney.read.getProjectByID([BigInt(2)]);

            const info = await NoneMoney.read.getSettleableProjectCountAddition(
                { account: donor.account.address }
            );

            let addition1_money = (project1[7] / 100n) * 5n;
            let addition3_money = (project3[7] / 100n) * 5n;
            expect(info[0]).to.equal(true);
            expect(info[1]).to.equal(2n);
            expect(info[2]).to.equal(addition1_money + addition3_money);
        });

        it("showSettledProjectByAccount", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder, donor1, donor2] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(100), BigInt(2000)],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(100),
                account: donor1.account
            });
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(100),
                account: donor2.account
            });

            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(100), BigInt(200)],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(100), BigInt(200)],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.addProjectDonor([BigInt(2)], {
                value: BigInt(100),
                account: donor1.account
            });

            const donor1_settle_project =
                await NoneMoney.read.showSettledProjectByAccount({
                    account: donor1.account?.address
                });

            expect(donor1_settle_project[0][0]).to.equal(0n); //id
            expect(donor1_settle_project[1][0]).to.equal("project"); //project_name
            expect(donor1_settle_project[2][0]).to.equal(100n); //start date
            expect(donor1_settle_project[3][0]).to.equal(100n); //deadline

            const project = await NoneMoney.read.getProjectByID([BigInt(0)]);

            expect(donor1_settle_project[4][0]).to.equal(project[7]); //get_money
            expect(donor1_settle_project[5][0]).to.equal((100n / 100n) * 95n); //donor_donate_money

            let additional_money = (project[7] / 100n) * 5n;
            expect(donor1_settle_project[6][0]).to.equal(additional_money); //additional_money

            expect(donor1_settle_project[0][1]).to.equal(2n); //id
        });
    });

    describe("Show", function () {
        it("showAllProject", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder] = await hre.viem.getWalletClients();

            const now = await NoneMoney.read.getCurrentTimestamp();
            const now_10 = now * 10n;

            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(now_10), BigInt(2000)],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(100), BigInt(2000)],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(now_10), BigInt(2000)],
                {
                    account: holder.account.address
                }
            );

            const all_project = await NoneMoney.read.showAllProject();

            expect(all_project[0][0]).to.equal(0n); //id
            expect(all_project[1][0]).to.equal("project"); //project_name
            expect(all_project[2][0]).to.equal(100n); //start date
            expect(all_project[3][0]).to.equal(now_10); //deadline
            expect(all_project[4][0]).to.equal(2000n); //target
            expect(all_project[5][0]).to.equal(0n); //get

            expect(all_project[0][1]).to.equal(1n);
            expect(all_project[0][2]).to.equal(2n);
        });

        it("showProjectsFilterDeadline", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder] = await hre.viem.getWalletClients();

            const now = await NoneMoney.read.getCurrentTimestamp();
            const now_10 = now * 10n;

            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(now_10), BigInt(2000)],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(100), BigInt(2000)],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(now_10), BigInt(2000)],
                {
                    account: holder.account.address
                }
            );

            const filter_project =
                await NoneMoney.read.showProjectsFilterDeadline();

            expect(filter_project[0][0]).to.equal(0n); //id
            expect(filter_project[1][0]).to.equal("project"); //project_name
            expect(filter_project[2][0]).to.equal(100n); //start date
            expect(filter_project[3][0]).to.equal(now_10); //deadline
            expect(filter_project[4][0]).to.equal(2000n); //target
            expect(filter_project[5][0]).to.equal(0n); //get

            expect(filter_project[0][1]).to.equal(2n);
        });

        it("showHoldersProject", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder, holder2] = await hre.viem.getWalletClients();

            const now = await NoneMoney.read.getCurrentTimestamp();
            const now_10 = now * 10n;

            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(now_10), BigInt(2000)],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(100), BigInt(2000)],
                {
                    account: holder2.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(now_10), BigInt(2000)],
                {
                    account: holder.account.address
                }
            );

            const holder1_have_project =
                await NoneMoney.read.showHoldersProject([
                    holder.account?.address
                ]);

            expect(holder1_have_project[0][0]).to.equal(0n); //id
            expect(holder1_have_project[1][0]).to.equal("project"); //project_name
            expect(holder1_have_project[2][0]).to.equal(0); //project_state
            expect(holder1_have_project[3][0]).to.equal(100n); //start date
            expect(holder1_have_project[4][0]).to.equal(now_10); //deadline
            expect(holder1_have_project[5][0]).to.equal(2000n); //target
            expect(holder1_have_project[6][0]).to.equal(0n); //get

            expect(holder1_have_project[0][1]).to.equal(2n);
        });
    });

    describe("Sort", function () {
        it("sortProjectDonorByDonateMoney", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder, donor1, donor2, donor3] =
                await hre.viem.getWalletClients();

            await NoneMoney.write.addProject(
                ["project", "test", BigInt(100), BigInt(100), BigInt(2000)],
                {
                    account: holder.account.address
                }
            ); //project_id = 0;
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(50),
                account: donor1.account
            });
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(500),
                account: donor2.account
            });
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(70),
                account: donor3.account
            });

            const sort_project_donor =
                await NoneMoney.read.sortProjectDonorByDonateMoney([BigInt(0)]);

            expect(sort_project_donor[0][0]).to.equal(
                getAddress(donor2.account.address)
            );
            expect(sort_project_donor[0][1]).to.equal(
                getAddress(donor3.account.address)
            );
            expect(sort_project_donor[0][2]).to.equal(
                getAddress(donor1.account.address)
            );
        });
    });
});
