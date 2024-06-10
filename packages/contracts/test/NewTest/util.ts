const abs = (n: bigint) => (n < 0n ? -n : n);

export async function addProject(NoneMoney: any, address: `0x${string}`) {
    await NoneMoney.write.addProject(
        [
            "name", // _name:
            "description", // _description:
            100n, // _start_date:
            100n, // _deadline:
            20000000000000000n // _target_money:
        ],
        {
            account: address
        }
    );
}
