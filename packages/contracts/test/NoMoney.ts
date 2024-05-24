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
        it("add_project", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder] = await hre.viem.getWalletClients();
            await NoneMoney.write.add_project([
                holder.account.address,
                "name",
                "description",
                BigInt(1)
            ]);
        });

        it("add_project_donor", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder, donor] = await hre.viem.getWalletClients();
            await NoneMoney.write.add_project([
                holder.account?.address,
                "project",
                "test",
                BigInt(200)
            ]); //project_id = 0;
            await NoneMoney.write.add_project_donor([BigInt(0)], {
                value: BigInt(50),
                account: donor.account
            });

            const project = await NoneMoney.read.search_project_by_id([
                BigInt(0)
            ]);

            expect(project[0]).to.equal(0n); //project_id
            expect(project[1]).to.equal("project"); //project_name
            expect(project[2]).to.equal("test"); //project_description
            expect(project[3]).to.equal(getAddress(holder.account.address));
            expect(project[4]).to.equal(false); //state false:open true:finish
            expect(project[5]).to.equal(200n); //target
            expect(project[6]).to.equal(50n); //get
        });

        it("add_project_donor_finish", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);

            const [holder, donor] = await hre.viem.getWalletClients();
            await NoneMoney.write.add_project([
                holder.account?.address,
                "project",
                "test",
                BigInt(200)
            ]); //project_id = 0;
            await NoneMoney.write.add_project_donor([BigInt(0)], {
                value: BigInt(100),
                account: donor.account
            });
            await NoneMoney.write.add_project_donor([BigInt(0)], {
                value: BigInt(100),
                account: donor.account
            });

            const project = await NoneMoney.read.search_project_by_id([
                BigInt(0)
            ]);

            expect(project[5]).to.equal(200n);
            expect(project[6]).to.equal(200n);
        });

        it("check_project_donor_finish_return", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);

            const [holder, donor1, donor2] = await hre.viem.getWalletClients();
            const publicClient = await hre.viem.getPublicClient();

            await NoneMoney.write.add_project(
                [holder.account?.address, "project", "test", BigInt(5)],
                { account: holder.account }
            ); //project_id = 0;

            const holderBalance_before = await publicClient.getBalance({
                address: holder.account.address
            });

            await NoneMoney.write.add_project_donor([BigInt(0)], {
                value: BigInt(3),
                account: donor1.account
            });
            await NoneMoney.write.add_project_donor([BigInt(0)], {
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
        it("show_project", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder] = await hre.viem.getWalletClients();
            await NoneMoney.write.add_project([
                holder.account.address,
                "name",
                "description",
                BigInt(1)
            ]);
            await NoneMoney.write.add_project([
                holder.account?.address,
                "project",
                "test",
                BigInt(200)
            ]);
            await NoneMoney.write.add_project([
                holder.account?.address,
                "project",
                "test",
                BigInt(400)
            ]);

            const project_id = await NoneMoney.read.show_donate_projects_id();

            expect(project_id[0]).to.equal(0n);
            expect(project_id[1]).to.equal(1n);
            expect(project_id[2]).to.equal(2n);
        });

        it("show_holder", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);

            const [holder1, holder2, holder3] =
                await hre.viem.getWalletClients();
            await NoneMoney.write.add_project([
                holder1.account?.address,
                "project1",
                "test1",
                BigInt(100)
            ]);
            await NoneMoney.write.add_project([
                holder1.account?.address,
                "project2",
                "test2",
                BigInt(200)
            ]);
            await NoneMoney.write.add_project([
                holder2.account?.address,
                "project3",
                "test3",
                BigInt(300)
            ]);
            await NoneMoney.write.add_project([
                holder3.account?.address,
                "project4",
                "test4",
                BigInt(400)
            ]);

            const holder_account = await NoneMoney.read.show_holders_account();

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
    });

    describe("Check", function () {
        it("check_balance", async function () {
            const { NoneMoney } = await loadFixture(depolyMainContract);
            const [holder, donor] = await hre.viem.getWalletClients();

            await NoneMoney.write.add_project([
                holder.account.address,
                "name",
                "description",
                BigInt(100)
            ]);
            await NoneMoney.write.add_project_donor([BigInt(0)], {
                value: BigInt(40),
                account: donor.account
            });

            const contract_balance =
                await NoneMoney.read.get_contract_balance();

            expect(contract_balance).to.equal(40n);
        });
    });
});
