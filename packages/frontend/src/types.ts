import { Address } from "viem";

/* eslint-disable no-unused-vars */
export enum State {
    CAN_DONATE,
    WAITING_SETTLE, // SUCCESS,
    EXPIRED_SETTLED, // FAILED
    GOAL_SETTLED // SUCCESS
}
/* eslint-enable no-unused-vars */

export type Project = {
    id: bigint;
    title: string;
    description?: string;
    goal: bigint;
    current: bigint;
    deadline: Date;
    state: State;
    owner: Address;
    donors: readonly Address[];
    overdue: boolean;
};
