import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OutOfMoneyErrorModule = buildModule("OutOfMoneyErrorModule", m => {
    const noneMoney = m.contract("NoneMoney");

    return { noneMoney };
});

export default OutOfMoneyErrorModule;
