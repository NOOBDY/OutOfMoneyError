import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

describe("test NoneMoney contract", function () {
    async function deployMainContract() {
        const NoneMoney = await hre.viem.deployContract("NoneMoney", [], {});

        return {
            NoneMoney
        };
    }

    describe("Deployment", function () {
        it("work", async function () {
            await loadFixture(deployMainContract);
        });
    });

    describe("Add", function () {
        it("addProject", async function () {
            //加入project
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                [
                    //  _holder_account:
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

            expect(project[0]).to.equal("name");
            expect(project[1]).to.equal("description");
            expect(project[2]).to.equal(getAddress(holder.account.address));
            expect(project[3]).to.equal(0); //state
            expect(project[4]).to.equal(100n); //start_date
            expect(project[5]).to.equal(100n); //deadline
            expect(project[6]).to.equal(20000000000000000n); //target
            expect(project[7]).to.equal(0n); //get
        });

        it("addProjectDonor", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, donor] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 100n, 20000000000000000n],
                {
                    account: holder.account.address
                }
            ); //project_id = 0;
            await NoneMoney.write.addProjectDonor([0n], {
                value: 50n,
                account: donor.account
            });

            const project = await NoneMoney.read.getProjectByID([0n]);

            expect(project[0]).to.equal("project"); //project_name
            expect(project[1]).to.equal("test"); //project_description
            expect(project[2]).to.equal(getAddress(holder.account.address));
            expect(project[3]).to.equal(0); //state false:open true:finish
            expect(project[6]).to.equal(20000000000000000n); //target
            expect(project[7]).to.equal(50n); //get
        });
    });

    describe("ToSettleProject", function () {
        it("settleOverdueProject", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, donor1, donor2] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 100n, 20000000000000000n],
                {
                    account: holder.account.address
                }
            ); //project_id = 0;
            await NoneMoney.write.addProjectDonor([0n], {
                value: 1700n,
                account: donor1.account
            });
            await NoneMoney.write.addProjectDonor([0n], {
                value: 300n,
                account: donor2.account
            });

            await NoneMoney.write.settleOverdueProject([0n], {
                account: donor1.account
            });

            await NoneMoney.write.settleOverdueProject([0n], {
                account: donor2.account
            });
        });

        it("settleFinishProject", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, donor1] = await hre.viem.getWalletClients();
            const now = await NoneMoney.read.getCurrentTimestamp();
            const now_10 = now * 10n;

            await NoneMoney.write.addProject(
                [
                    "project",
                    "test",
                    BigInt(100),
                    now_10,
                    BigInt(2000000000000000)
                ],
                {
                    account: holder.account.address
                }
            ); //project_id = 0;
            await NoneMoney.write.addProjectDonor([0n], {
                value: 1000000000000000n,
                account: donor1.account
            });
            await NoneMoney.write.addProjectDonor([0n], {
                value: 1000000000000000n,
                account: donor1.account
            });

            await NoneMoney.write.settleFinishProject([0n]);
        });

        it("getSettleableProjectCountAddition", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, donor] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test1", 100n, 100n, 1000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProjectDonor([0n], {
                value: 100n,
                account: donor.account
            });

            await NoneMoney.write.addProject(
                ["project", "test2", 100n, 100n, 1000000000000000n],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.addProject(
                ["project", "test3", 100n, 100n, 1000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProjectDonor([2n], {
                value: 190n,
                account: donor.account
            });

            const info = await NoneMoney.read.getSettleableProjectCountAddition(
                [200n],
                { account: donor.account.address }
            );
            expect(info[0]).to.equal(true);
            expect(info[1]).to.equal(2n);
            expect(info[2]).to.equal(100n + 190n);
        });

        it("showSettledProjectByAccount", async function () {
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, donor1, donor2] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 100n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.addProjectDonor([0n], {
                value: 100n,
                account: donor1.account
            });
            await NoneMoney.write.addProjectDonor([0n], {
                value: 100n,
                account: donor2.account
            });

            await NoneMoney.write.addProject(
                ["project", "test", 100n, 100n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.addProject(
                ["project", "test", 100n, 100n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.addProjectDonor([2n], {
                value: 100n,
                account: donor1.account
            });

            const donor1_settle_project =
                await NoneMoney.read.showSettledProjectByAccount([200n], {
                    account: donor1.account?.address
                });

            expect(donor1_settle_project[0][0]).to.equal(0n); //id
            expect(donor1_settle_project[1][0]).to.equal("project"); //project_name
            expect(donor1_settle_project[2][0]).to.equal(100n); //start date
            expect(donor1_settle_project[3][0]).to.equal(100n); //deadline

            const project = await NoneMoney.read.getProjectByID([BigInt(0)]);

            expect(donor1_settle_project[4][0]).to.equal(project[7]); //get_money
            expect(donor1_settle_project[5][0]).to.equal(100n); //donor_donate_money

            expect(donor1_settle_project[0][1]).to.equal(2n); //id
        });
    });

    describe("Show", function () {
        it("showAllProject", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder] = await hre.viem.getWalletClients();
            const now = await NoneMoney.read.getCurrentTimestamp();
            const now_10 = now * 10n;
            await NoneMoney.write.addProject(
                ["project", "test", 100n, now_10, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 100n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", 100n, now_10, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            const all_project = await NoneMoney.read.showAllProject();
            expect(all_project[0][0]).to.equal(0n); //id
            expect(all_project[1][0]).to.equal("project"); //project_name
            expect(all_project[2][0]).to.equal(100n); //start date
            expect(all_project[3][0]).to.equal(now_10); //deadline
            expect(all_project[4][0]).to.equal(2000000000000000n); //target
            expect(all_project[5][0]).to.equal(0n); //get
            expect(all_project[0][1]).to.equal(1n);
            expect(all_project[0][2]).to.equal(2n);
        });
        it("showProjectsFilterDeadline", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder] = await hre.viem.getWalletClients();
            const now = await NoneMoney.read.getCurrentTimestamp();
            const now_10 = now * 10n;
            await NoneMoney.write.addProject(
                ["project", "test", 100n, now_10, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 100n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", 100n, now_10, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            const filter_project =
                await NoneMoney.read.showProjectsFilterDeadline([100n]);
            expect(filter_project[0][0]).to.equal(0n); //id
            expect(filter_project[1][0]).to.equal("project"); //project_name
            expect(filter_project[2][0]).to.equal(100n); //start date
            expect(filter_project[3][0]).to.equal(now_10); //deadline
            expect(filter_project[4][0]).to.equal(2000000000000000n); //target
            expect(filter_project[5][0]).to.equal(0n); //get
            expect(filter_project[0][1]).to.equal(2n);
        });
        it("showHoldersProject", async function () {
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, holder2] = await hre.viem.getWalletClients();
            const now = await NoneMoney.read.getCurrentTimestamp();
            const now_10 = now * 10n;
            await NoneMoney.write.addProject(
                ["project", "test", 100n, now_10, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 100n, 2000000000000000n],
                {
                    account: holder2.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", 100n, now_10, 2000000000000000n],
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
            expect(holder1_have_project[5][0]).to.equal(2000000000000000n); //target
            expect(holder1_have_project[6][0]).to.equal(0n); //get
            expect(holder1_have_project[0][1]).to.equal(2n);
        });
    });

    describe("Sort", function () {
        it("sortProjectDonorByDonateMoney", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, donor1, donor2, donor3] =
                await hre.viem.getWalletClients();

            await NoneMoney.write.addProject(
                ["project", "test", 100n, 100n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            ); //project_id = 0;
            await NoneMoney.write.addProjectDonor([0n], {
                value: 50n,
                account: donor1.account
            });
            await NoneMoney.write.addProjectDonor([0n], {
                value: 500n,
                account: donor2.account
            });
            await NoneMoney.write.addProjectDonor([0n], {
                value: 70n,
                account: donor3.account
            });

            const sort_project_donor =
                await NoneMoney.read.sortProjectDonorByDonateMoney([0n]);

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

    describe("Test", function () {
        it("testTime(only test time parameter)", async function () {
            const { NoneMoney } = await loadFixture(deployMainContract);
            const now = await NoneMoney.read.getCurrentTimestamp();

            const [holder] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                [
                    "project1",
                    "test1",
                    BigInt(now),
                    BigInt(now + 100n),
                    BigInt(2000000000000000n)
                ],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.addProject(
                [
                    "project2",
                    "test2",
                    BigInt(100), //second
                    BigInt(now + 20n),
                    BigInt(2000000000000000n)
                ],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                [
                    "project3",
                    "test3",
                    BigInt(100),
                    BigInt(now + 100n),
                    BigInt(2000000000000000n)
                ],
                {
                    account: holder.account.address
                }
            );
            const project_id = await NoneMoney.read.showProjectsFilterDeadline([
                now + 25n
            ]);

            expect(project_id[0][0]).to.equal(0n);
            expect(project_id[0][1]).to.equal(2n);
        });
    });
});
