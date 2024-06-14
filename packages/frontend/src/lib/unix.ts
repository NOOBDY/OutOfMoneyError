export function toUnix(date: Date) {
    return BigInt(Math.floor(date.getTime() / 1000).toFixed(0));
}

export function fromUnix(unix: bigint) {
    return new Date(Number(unix) * 1000);
}
