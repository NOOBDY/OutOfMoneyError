export type State =
    | 0 // CAN_DONATE
    | 1 // FINISH
    | 2; // EXPIRED_SETTLED_FINISH

export type Project = {
    id: bigint;
    title: string;
    description?: string;
    goal: bigint;
    current: bigint;
    deadline: Date;
};
