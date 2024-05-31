import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

describe("test NoneMoney contract", function () {
    async function depolyMainContract() {
        const NoneMoney = await hre.viem.deployContract("NoneMoney", [], {});

        return {
            NoneMoney
        };
    }

    function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    describe("Deployment", function () {
        it("work", async function () {
            await loadFixture(depolyMainContract);
        });
    });

    describe("Add", function () {
        // const projectData = {
        //     project_id: BigInt,
        //     project_name: string,
        //     project_description:string,
        //     project_address:`0x${string}`,
        //     target_money: BigInt,
        //     get_money: BigInt,
        // };
        it("addProject", async function () { //加入project
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject([
                holder.account.address,
                "name",
                "description",
                BigInt(100),
                BigInt(100),
                BigInt(1)
            ]);
        });

        it("addProjectDonor", async function () { //對特定project 加入donor
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder, donor] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject([
                holder.account?.address,
                "project",
                "test",
                BigInt(100),
                BigInt(100),
                BigInt(200)
            ]); //project_id = 0;
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(50),
                account: donor.account
            });

            const project = await NoneMoney.read.searchProjectByIDWithHolderAccount([
                BigInt(0)
            ]);

            expect(project[0]).to.equal("project"); //project_name
            expect(project[1]).to.equal("test"); //project_description
            expect(project[2]).to.equal(getAddress(holder.account.address));
            expect(project[3]).to.equal(false); //state false:open true:finish
            expect(project[4]).to.equal(200n); //target
            expect(project[5]).to.equal(50n); //get
        });

        it("addProjectDonor_finish", async function () { //如果金額達標，轉帳給holder
            const { NoneMoney } = await loadFixture(depolyMainContract);

            const [holder, donor] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject([
                holder.account?.address,
                "project",
                "test",
                BigInt(100),
                BigInt(100),
                BigInt(200)
            ]); //project_id = 0;
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(100),
                account: donor.account
            });
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(100),
                account: donor.account
            });

            const project = await NoneMoney.read.searchProjectByIDWithHolderAccount([
                BigInt(0)
            ]);

            expect(project[4]).to.equal(200n);
            expect(project[5]).to.equal(200n);
        });

        it("checkProjectDonor_finishReturn", async function () { //如果金額達標，轉帳給holder，多餘的錢退款給donor
            const { NoneMoney } = await loadFixture(depolyMainContract);

            const [holder, donor1, donor2] = await hre.viem.getWalletClients();
            const publicClient = await hre.viem.getPublicClient();

            await NoneMoney.write.addProject(
                [holder.account?.address, "project", "test", BigInt(200), BigInt(200), BigInt(5)],
                { account: holder.account }
            ); //project_id = 0;

            const holderBalance_before = await publicClient.getBalance({
                address: holder.account.address
            });

            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(3),
                account: donor1.account
            });
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(7),
                account: donor2.account
            });

            const holderBalance_after = await publicClient.getBalance({
                address: holder.account.address
            });

            expect(holderBalance_after).to.equal(
                holderBalance_before + BigInt(5)
            );
        });
    });

    describe("Show", function () {
        it("show_project", async function () { //show 出全部 project id
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder] = await hre.viem.getWalletClients();
            await NoneMoney.write.addProject([
                holder.account.address,
                "name",
                "description",
                BigInt(100),
                BigInt(100),
                BigInt(1)
            ]);
            await NoneMoney.write.addProject([
                holder.account?.address,
                "project",
                "test",
                BigInt(100),
                BigInt(100),
                BigInt(200)
            ]);
            await NoneMoney.write.addProject([
                holder.account?.address,
                "project",
                "test",
                BigInt(100),
                BigInt(100),
                BigInt(400)
            ]);

            const project_id = await NoneMoney.read.showDonateProjectsID();

            expect(project_id[0]).to.equal(0n);
            expect(project_id[1]).to.equal(1n);
            expect(project_id[2]).to.equal(2n);
        });

        it("showHolder", async function () { //show 出全部的holder
            const { NoneMoney } = await loadFixture(depolyMainContract);

            const [holder1, holder2, holder3] =
                await hre.viem.getWalletClients();

            await NoneMoney.write.addProject([
                holder1.account?.address,
                "project1",
                "test1",
                BigInt(100),
                BigInt(100),
                BigInt(100)
            ]);
            
            await NoneMoney.write.addProject([
                holder1.account?.address,
                "project2",
                "test2",
                BigInt(100),
                BigInt(100),
                BigInt(200)
            ]);
            
            await NoneMoney.write.addProject([
                holder2.account?.address,
                "project3",
                "test3",
                BigInt(100),
                BigInt(100),
                BigInt(300)
            ]);

            await NoneMoney.write.addProject([
                holder3.account?.address,
                "project4",
                "test4",
                BigInt(100),
                BigInt(100),
                BigInt(400)
            ]);

            const holder_account = await NoneMoney.read.showHoldersAccount();

            expect(holder_account[0]).to.equal(
                getAddress(holder1.account.address)
            );
            expect(holder_account[1]).to.equal(
                getAddress(holder2.account.address)
            );
            expect(holder_account[2]).to.equal(
                getAddress(holder3.account.address)
            );
        });


        it("showHoldersProjectArr", async function () { //show 特定holder所擁有的project
            const { NoneMoney } = await loadFixture(depolyMainContract);

            const [holder1, holder2] =
                await hre.viem.getWalletClients();
            await NoneMoney.write.addProject([
                holder1.account?.address,
                "project1",
                "test1",
                BigInt(100),
                BigInt(100),
                BigInt(100)
            ]);
            await NoneMoney.write.addProject([
                holder2.account?.address,
                "project3",
                "test3",
                BigInt(100),
                BigInt(100),
                BigInt(300)
            ]);
            await NoneMoney.write.addProject([
                holder1.account?.address,
                "project2",
                "test2",
                BigInt(100),
                BigInt(100),
                BigInt(200)
            ]);

            const holder_arr1 = await NoneMoney.read.showHoldersProjectArr([holder1.account.address]);
            const holder_arr2 = await NoneMoney.read.showHoldersProjectArr([holder2.account.address]);

            expect(holder_arr1[0]).to.equal(0n);
            expect(holder_arr1[1]).to.equal(2n);
            expect(holder_arr2[0]).to.equal(1n);
        });


        it("showProjectByIDFilterDeadline", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const now = await NoneMoney.read.getCurrentTimestamp()
            const [holder1, holder2, holder3] =
                await hre.viem.getWalletClients();
            await NoneMoney.write.addProject([
                holder1.account?.address,
                "project1",
                "test1",
                BigInt(now),
                BigInt(now + 100n),
                BigInt(100)
            ]);
            await NoneMoney.write.addProject([
                holder1.account?.address,
                "project2",
                "test2",
                BigInt(100), //second
                BigInt(now + 1n),
                BigInt(200)
            ]);
            await NoneMoney.write.addProject([
                holder2.account?.address,
                "project3",
                "test3",
                BigInt(100),
                BigInt(now + 100n),
                BigInt(300)
            ]);

            await sleep(2000);

            const project_id = await NoneMoney.read.showProjectByIDFilterDeadline();

            expect(project_id[0]).to.equal(0n);
            expect(project_id[1]).to.equal(2n);

        });

        it("showProjectByIDAfterDeadline", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const now = await NoneMoney.read.getCurrentTimestamp()
            const [holder1, holder2, holder3] =
                await hre.viem.getWalletClients();
            await NoneMoney.write.addProject([
                holder1.account?.address,
                "project1",
                "test1",
                BigInt(now),
                BigInt(now + 100n),
                BigInt(100)
            ]);
            await NoneMoney.write.addProject([
                holder1.account?.address,
                "project2",
                "test2",
                BigInt(100), //second
                BigInt(now + 1n),
                BigInt(200)
            ]);
            await NoneMoney.write.addProject([
                holder2.account?.address,
                "project3",
                "test3",
                BigInt(100),
                BigInt(now + 100n),
                BigInt(300)
            ]);

            await sleep(2000);

            const project_id = await NoneMoney.read.showProjectsAfterDeadline();

            expect(project_id[0]).to.equal(1n);

        });
    });

    describe("Check", function () {
        it("checkBalance", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder, donor] = await hre.viem.getWalletClients();

            await NoneMoney.write.addProject([
                holder.account.address,
                "name",
                "description",
                BigInt(100),
                BigInt(100),
                BigInt(100)
            ]);
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(40),
                account: donor.account
            });

            const contract_balance =
                await NoneMoney.read.getContractBalance();

            expect(contract_balance).to.equal(40n);
        });
    });

    describe("Sort", function () {
        it("sortProjectDonorByDonateMoney", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder, donor1, donor2, donor3] = await hre.viem.getWalletClients();

            await NoneMoney.write.addProject([
                holder.account.address,
                "name",
                "description",
                BigInt(100),
                BigInt(100),
                BigInt(100)
            ]);
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(100),
                account: donor1.account
            });
            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(500),
                account: donor2.account
            });

            await NoneMoney.write.addProjectDonor([BigInt(0)], {
                value: BigInt(50),
                account: donor3.account
            });

            const sort_result = await NoneMoney.read.sortProjectDonorByDonateMoney([BigInt(0)])

            expect(sort_result[0][0]).to.equal(getAddress(donor2.account.address));
            expect(sort_result[1][0]).to.equal(500n);
            expect(sort_result[0][1]).to.equal(getAddress(donor1.account.address));
            expect(sort_result[1][1]).to.equal(100n);
            expect(sort_result[0][2]).to.equal(getAddress(donor3.account.address));
            expect(sort_result[1][2]).to.equal(50n);
        });
    });
});
