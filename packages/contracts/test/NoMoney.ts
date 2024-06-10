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
                    101n, // _deadline:
                    20000000000000000n // _target_money:
                ],
                {
                    account: holder.account.address
                }
            );
            const project = await NoneMoney.read.getProjectByID([0n]);

            expect(project.id).to.equal(0n);
            expect(project.name).to.equal("name");
            expect(project.description).to.equal("description");
            expect(project.holder_account).to.equal(
                getAddress(holder.account.address)
            );
            expect(project.state).to.equal(0); //state
            expect(project.start_date).to.equal(100n); //start_date
            expect(project.deadline).to.equal(101n); //deadline
            expect(project.target_money).to.equal(20000000000000000n); //target
            expect(project.get_money).to.equal(0n); //get
        });

        it("donate", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, donor] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 101n, 20000000000000000n],
                {
                    account: holder.account.address
                }
            ); //project_id = 0;
            await NoneMoney.write.donate([0n], {
                value: 50n,
                account: donor.account
            });

            const project = await NoneMoney.read.getProjectByID([0n]);

            expect(project.donor_arr[0]).to.equal(
                getAddress(donor.account.address)
            );
        });
    });

    describe("ToSettleProject", function () {
        it("settleOverdueProject", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, donor1, donor2] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 101n, 20000000000000000n],
                {
                    account: holder.account.address
                }
            ); //project_id = 0;
            await NoneMoney.write.donate([0n], {
                value: 1700n,
                account: donor1.account
            });
            await NoneMoney.write.donate([0n], {
                value: 300n,
                account: donor2.account
            });

            await NoneMoney.write.settleOverdueProject([0n, 105n], {
                account: donor1.account
            });

            await NoneMoney.write.settleOverdueProject([0n, 105n], {
                account: donor2.account
            });
        });

        it("settleFinishProject", async function () {
            //         //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, donor1] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 101n, BigInt(2000000000000000)],
                {
                    account: holder.account.address
                }
            ); //project_id = 0;
            await NoneMoney.write.donate([0n], {
                value: 1000000000000000n,
                account: donor1.account
            });
            await NoneMoney.write.donate([0n], {
                value: 1000000000000000n,
                account: donor1.account
            });
            await NoneMoney.write.settleFinishProject([0n]);
        });

        it("getRefundation", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, donor] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test1", 100n, 101n, 1000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.donate([0n], {
                value: 100n,
                account: donor.account
            });

            await NoneMoney.write.addProject(
                ["project", "test2", 100n, 101n, 1000000000000000n],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.addProject(
                ["project", "test3", 100n, 101n, 1000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.donate([2n], {
                value: 190n,
                account: donor.account
            });

            const info = await NoneMoney.read.getRefundation([200n], {
                account: donor.account.address
            });
            expect(info[0]).to.equal(true);
            expect(info[1]).to.equal(2n);
            expect(info[2]).to.equal(100n + 190n);
        });

        it("showSettledProjectByAccount", async function () {
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, donor1, donor2] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 101n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.donate([0n], {
                value: 101n,
                account: donor1.account
            });
            await NoneMoney.write.donate([0n], {
                value: 101n,
                account: donor2.account
            });

            await NoneMoney.write.addProject(
                ["project", "test", 100n, 101n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.addProject(
                ["project", "test", 100n, 101n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.donate([2n], {
                value: 101n,
                account: donor1.account
            });

            const donor1_settle_project =
                await NoneMoney.read.showSettledProjectByAccount([200n], {
                    account: donor1.account?.address
                });

            expect(donor1_settle_project[0].id).to.equal(0n);
            expect(donor1_settle_project[1].id).to.equal(2n);
        });
    });

    describe("Show", function () {
        it("showAllProject", async function () {
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 101n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project1", "test1", 100n, 101n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project2", "test2", 100n, 101n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            const all_project = await NoneMoney.read.showAllProject();
            expect(all_project[0].id).to.equal(0n);
            expect(all_project[0].name).to.equal("project");
            expect(all_project[0].description).to.equal("test");
            expect(all_project[0].holder_account).to.equal(
                getAddress(holder.account.address)
            );
            expect(all_project[0].state).to.equal(0);
            expect(all_project[0].start_date).to.equal(100n);
            expect(all_project[0].deadline).to.equal(101n);
            expect(all_project[0].target_money).to.equal(2000000000000000n);
            expect(all_project[0].get_money).to.equal(0n);

            expect(all_project[1].id).to.equal(1n);
            expect(all_project[1].name).to.equal("project1");
            expect(all_project[1].description).to.equal("test1");

            expect(all_project[2].id).to.equal(2n);
            expect(all_project[2].name).to.equal("project2");
            expect(all_project[2].description).to.equal("test2");
        });
        it("showAvailableProject", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 110n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 105n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 110n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            const avaliable_project = await NoneMoney.read.showAvailableProject(
                [106n]
            );

            expect(avaliable_project[0].id).to.equal(0n);
            expect(avaliable_project[0].name).to.equal("project");
            expect(avaliable_project[0].description).to.equal("test");
            expect(avaliable_project[0].holder_account).to.equal(
                getAddress(holder.account.address)
            );
            expect(avaliable_project[0].state).to.equal(0);
            expect(avaliable_project[0].start_date).to.equal(100n);
            expect(avaliable_project[0].deadline).to.equal(110n);
            expect(avaliable_project[0].target_money).to.equal(
                2000000000000000n
            );

            expect(avaliable_project[1].id).to.equal(2n);
        });
        it("showHoldersProject", async function () {
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder1, holder2] = await hre.viem.getWalletClients();

            await NoneMoney.write.addProject(
                ["project", "test", 100n, 101n, 2000000000000000n],
                {
                    account: holder1.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 101n, 2000000000000000n],
                {
                    account: holder2.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 101n, 2000000000000000n],
                {
                    account: holder1.account.address
                }
            );
            const holder1_have_project =
                await NoneMoney.read.showProjectByHolders([
                    holder1.account?.address
                ]);
            expect(holder1_have_project[0].id).to.equal(0n); //id
            expect(holder1_have_project[0].name).to.equal("project");
            expect(holder1_have_project[0].description).to.equal("test");
            expect(holder1_have_project[0].holder_account).to.equal(
                getAddress(holder1.account.address)
            );
            expect(holder1_have_project[0].state).to.equal(0);
            expect(holder1_have_project[0].start_date).to.equal(100n);
            expect(holder1_have_project[0].deadline).to.equal(101n);
            expect(holder1_have_project[0].target_money).to.equal(
                2000000000000000n
            );
        });
    });

    describe("Sort", function () {
        it("sortProjectDonorByDonateMoney", async function () {
            //對特定project 加入donor
            const { NoneMoney } = await loadFixture(deployMainContract);
            const [holder, donor1, donor2, donor3] =
                await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project", "test", 100n, 101n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            ); //project_id = 0;
            await NoneMoney.write.donate([0n], {
                value: 50n,
                account: donor1.account
            });
            await NoneMoney.write.donate([0n], {
                value: 500n,
                account: donor2.account
            });
            await NoneMoney.write.donate([0n], {
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
            const [holder] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject(
                ["project1", "test1", 100n, 200n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );

            await NoneMoney.write.addProject(
                ["project2", "test2", 100n, 120n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            await NoneMoney.write.addProject(
                ["project3", "test3", 100n, 200n, 2000000000000000n],
                {
                    account: holder.account.address
                }
            );
            const project = await NoneMoney.read.showAvailableProject([150n]);

            expect(project[0].id).to.equal(0n);
            expect(project[1].id).to.equal(2n);
        });
    });
});
